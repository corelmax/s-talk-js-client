var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
import * as async from "async";
import { BackendFactory } from "../BackendFactory";
import ChatLog from "./models/ChatLog";
import { MessageType } from "../models/index";
import { RoomType } from "./models/index";
import * as CryptoHelper from "./utils/CryptoHelper";
import InternalStore from "./InternalStore";
import * as chatroomService from "./services/ChatroomService";
// import * as chatlogActionsHelper from "./redux/chatlogs/chatlogActionsHelper";
const avatar = require("./assets/ic_account_circle_black_48dp/web/ic_account_circle_black_48dp_2x.png");
export class Unread {
}
export function getUnreadMessage(user_id, roomAccess) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield chatroomService.getUnreadMessage(roomAccess.roomId, user_id, roomAccess.accessTime.toString());
        let value = yield response.json();
        if (value.success) {
            let unread = value.result;
            unread.rid = roomAccess.roomId;
            let decoded = yield CryptoHelper.decryptionText(unread.message);
            return unread;
        }
        else {
            throw new Error(value.message);
        }
    });
}
export class ChatsLogComponent {
    constructor() {
        this.chatlog_count = 0;
        this.chatslog = new Map();
        this.unreadMessageMap = new Map();
        this.chatListeners = new Array();
        console.log("Create ChatsLogComponent");
        this._isReady = false;
        let backendFactory = BackendFactory.getInstance();
        this.dataListener = backendFactory.dataListener;
        this.dataListener.addOnRoomAccessListener(this.onAccessRoom.bind(this));
        this.dataListener.addOnChatListener(this.onChat.bind(this));
        this.dataListener.addOnAddRoomAccessListener(this.onAddRoomAccess.bind(this));
        this.dataListener.addOnUpdateRoomAccessListener(this.onUpdatedLastAccessTime.bind(this));
    }
    getChatsLog() {
        return Array.from(this.chatslog.values());
    }
    getUnreadMessageMap() {
        return this.unreadMessageMap;
    }
    setUnreadMessageMap(unreads) {
        unreads.map(v => {
            this.unreadMessageMap.set(v.rid, v);
        });
    }
    addUnreadMessage(unread) {
        this.unreadMessageMap.set(unread.rid, unread);
    }
    getUnreadItem(room_id) {
        return this.unreadMessageMap.get(room_id);
    }
    onUpdatedLastAccessTime(data) {
        if (!!this.updatedLastAccessTimeEvent) {
            this.updatedLastAccessTimeEvent(data);
        }
    }
    addOnChatListener(listener) {
        this.chatListeners.push(listener);
    }
    onChat(message) {
        console.log("ChatsLogComponent.onChat", message);
        let self = this;
        CryptoHelper.decryptionText(message).then((decoded) => {
            // Provide chatslog service.
            self.chatListeners.map((v, i, a) => {
                v(decoded);
            });
        });
    }
    onAccessRoom(dataEvent) {
        let self = this;
        this.unreadMessageMap.clear();
        this.chatslog.clear();
        let roomAccess = dataEvent.roomAccess;
        let results = new Array();
        const done = () => {
            self._isReady = true;
            if (!!self.onReady) {
                self.onReady(results);
            }
        };
        async.each(roomAccess, (item, resultCallback) => {
            self.getRoomInfo(item.roomId)
                .then(room => {
                results.push(room);
                resultCallback();
            }).catch(err => {
                if (err)
                    console.warn("getRoomInfo", err);
                resultCallback();
            });
        }, (err) => {
            console.log("onAccessRoom.finished!", err);
            done();
        });
    }
    onAddRoomAccess(dataEvent) {
        console.warn("ChatsLogComponent.onAddRoomAccess", JSON.stringify(dataEvent));
        if (!!this.addNewRoomAccessEvent) {
            this.addNewRoomAccessEvent(dataEvent);
        }
    }
    getUnreadMessages(user_id, roomAccess, callback) {
        let self = this;
        let unreadLogs = new Array();
        // create a queue object with concurrency 2
        let q = async.queue(function (task, callback) {
            if (!!task.roomId && !!task.accessTime) {
                self.getUnreadMessage(user_id, task).then(value => {
                    unreadLogs.push(value);
                    callback();
                }).catch(err => {
                    if (err) {
                        console.warn("getUnreadMessage", err);
                    }
                    callback();
                });
            }
            else {
                callback();
            }
        }, 10);
        // assign a callback
        q.drain = function () {
            console.log("getUnreadMessages from your roomAccess is done.");
            callback(undefined, unreadLogs);
        };
        // add some items to the queue (batch-wise)
        if (roomAccess && roomAccess.length > 0) {
            q.push(roomAccess, function (err) {
                if (!!err)
                    console.error("getUnreadMessage err", err);
            });
        }
        else {
            callback(undefined, undefined);
        }
    }
    getUnreadMessage(user_id, roomAccess) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield chatroomService.getUnreadMessage(roomAccess.roomId, user_id, roomAccess.accessTime.toString());
            let value = yield response.json();
            console.log("getUnreadMessage result: ", value);
            if (value.success) {
                let unread = value.result;
                unread.rid = roomAccess.roomId;
                let decoded = yield CryptoHelper.decryptionText(unread.message);
                return unread;
            }
            else {
                throw new Error(value.message);
            }
        });
    }
    decorateRoomInfoData(roomInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (roomInfo.type === RoomType.privateChat) {
                if (Array.isArray(roomInfo.members)) {
                    let others = roomInfo.members.filter((value) => value._id !== InternalStore.authStore.user._id);
                    if (others.length > 0) {
                        let contact = others[0];
                        roomInfo.owner = (contact.username) ? contact.username : "EMPTY ROOM";
                        roomInfo.image = (contact.avatar) ? contact.avatar : avatar;
                    }
                }
            }
            return roomInfo;
        });
    }
    getRoomInfo(room_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let response = yield chatroomService.getRoomInfo(room_id);
            let json = yield response.json();
            if (json.success) {
                let roomInfos = json.result;
                let room = yield self.decorateRoomInfoData(roomInfos[0]);
                return Promise.resolve(room);
            }
            else {
                return Promise.reject(undefined);
            }
        });
    }
    getRoomsInfo(user_id, chatrooms) {
        let self = this;
        // create a queue object with concurrency 2
        let q = async.queue(function (task, callback) {
            let value = task;
            let rooms = chatrooms.filter(v => v._id === value.rid);
            let roomInfo = (rooms.length > 0) ? rooms[0] : undefined;
            if (!!roomInfo) {
                self.decorateRoomInfoData(roomInfo).then(room => {
                    chatrooms.forEach(v => {
                        if (v._id === room._id) {
                            v = room;
                        }
                    });
                    self.organizeChatLogMap(value, room, function done() {
                        callback();
                    });
                }).catch(err => {
                    callback();
                });
            }
            else {
                console.log("Can't find roomInfo from persisted data: ", value.rid);
                self.getRoomInfo(value.rid).then(room => {
                    chatrooms.forEach(v => {
                        if (v._id === room._id) {
                            v = room;
                        }
                    });
                    self.organizeChatLogMap(value, room, function done() {
                        callback();
                    });
                }).catch(err => {
                    console.warn(err);
                    callback();
                });
            }
        }, 10);
        // assign a callback
        q.drain = function () {
            console.log("getRoomsInfo Completed.");
            if (self.getRoomsInfoCompleteEvent()) {
                self.getRoomsInfoCompleteEvent();
            }
        };
        this.unreadMessageMap.forEach((value, key, map) => {
            // add some items to the queue
            q.push(value, function (err) { });
        });
    }
    manageChatLog(chatrooms) {
        let self = this;
        return new Promise((resolve, rejected) => {
            // create a queue object with concurrency 2
            let q = async.queue(function (task, callback) {
                let unread = task;
                let rooms = chatrooms.filter(v => v._id === unread.rid);
                let room = (rooms.length > 0) ? rooms[0] : undefined;
                if (!room) {
                    callback();
                }
                self.organizeChatLogMap(unread, room, () => {
                    callback();
                });
            }, 2);
            // assign a callback
            q.drain = function () {
                resolve(self.chatslog);
            };
            this.unreadMessageMap.forEach((value, key, map) => {
                // add some items to the queue
                q.push(value, function (err) { });
            });
        });
    }
    organizeChatLogMap(unread, roomInfo, done) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let log = new ChatLog(roomInfo);
            log.setNotiCount(unread.count);
            if (!!unread.message) {
                log.setLastMessageTime(unread.message.createTime.toString());
                let contact = null;
                try {
                    contact = yield chatlogActionsHelper.getContactProfile(unread.message.sender);
                }
                catch (err) {
                    if (err) {
                        console.warn("get sender contact fail", err.message);
                    }
                }
                let sender = (!!contact) ? contact.username : "";
                if (unread.message.body !== null) {
                    let displayMsg = unread.message.body;
                    switch (`${unread.message.type}`) {
                        case MessageType[MessageType.Text]:
                            /*
                                self.main.decodeService(displayMsg, function (err, res) {
                                    if (!err) {
                                        displayMsg = res;
                                    } else { console.warn(err, res); }
                                });
                            */
                            self.setLogProp(log, displayMsg, function (log) {
                                self.addChatLog(log, done);
                            });
                            break;
                        case MessageType[MessageType.Sticker]:
                            displayMsg = sender + " sent a sticker.";
                            self.setLogProp(log, displayMsg, function (log) {
                                self.addChatLog(log, done);
                            });
                            break;
                        case MessageType[MessageType.Voice]:
                            displayMsg = sender + " sent a voice message.";
                            self.setLogProp(log, displayMsg, function (log) {
                                self.addChatLog(log, done);
                            });
                            break;
                        case MessageType[MessageType.Image]:
                            displayMsg = sender + " sent a image.";
                            self.setLogProp(log, displayMsg, function (log) {
                                self.addChatLog(log, done);
                            });
                            break;
                        case MessageType[MessageType.Video]:
                            displayMsg = sender + " sent a video.";
                            self.setLogProp(log, displayMsg, function (log) {
                                self.addChatLog(log, done);
                            });
                            break;
                        case MessageType[MessageType.Location]:
                            displayMsg = sender + " sent a location.";
                            self.setLogProp(log, displayMsg, function (log) {
                                self.addChatLog(log, done);
                            });
                            break;
                        case MessageType[MessageType.File]:
                            self.setLogProp(log, displayMsg, function (log) {
                                self.addChatLog(log, done);
                            });
                            break;
                        default:
                            console.log("bobo");
                            break;
                    }
                }
            }
            else {
                let displayMsg = "Start Chatting Now!";
                self.setLogProp(log, displayMsg, function (log) {
                    self.addChatLog(log, done);
                });
            }
        });
    }
    setLogProp(log, displayMessage, callback) {
        log.setLastMessage(displayMessage);
        callback(log);
    }
    addChatLog(chatLog, done) {
        this.chatslog.set(chatLog.id, chatLog);
        done();
    }
    checkRoomInfo(unread, chatrooms) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let rooms = (!!chatrooms && chatrooms.length > 0) ? chatrooms.filter(v => v._id === unread.rid) : [];
            let roomInfo = rooms[0];
            if (!roomInfo) {
                console.warn("No have roomInfo in room store.", unread.rid);
                let room = yield self.getRoomInfo(unread.rid);
                let p = new Promise((resolve, rejected) => {
                    if (!room) {
                        rejected();
                    }
                    else {
                        this.organizeChatLogMap(unread, room, () => {
                            resolve(room);
                        });
                    }
                });
                return p;
            }
            else {
                console.log("organize chats log of room: ", roomInfo.owner);
                let p = new Promise((resolve, rejected) => {
                    this.organizeChatLogMap(unread, roomInfo, () => {
                        resolve();
                    });
                });
            }
        });
    }
    getChatsLogCount() {
        return this.chatlog_count;
    }
    increaseChatsLogCount(num) {
        this.chatlog_count += num;
    }
    decreaseChatsLogCount(num) {
        this.chatlog_count -= num;
    }
    calculateChatsLogCount() {
        this.chatlog_count = 0;
        this.unreadMessageMap.forEach((value, key) => {
            let count = value.count;
            this.chatlog_count += count;
        });
    }
}
