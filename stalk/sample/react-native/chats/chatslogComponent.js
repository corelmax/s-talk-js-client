/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
"use strict";
const async = require('async');
const DataModels = require("./models/ChatDataModels");
const chatLog_1 = require("./models/chatLog");
const dataManager_1 = require("./dataManager");
const dataListener_1 = require("./dataListener");
const BackendFactory_1 = require("./BackendFactory");
const httpStatusCode_1 = require("../libs/stalk/utils/httpStatusCode");
const server = BackendFactory_1.default.getInstance().getServer();
const dataManager = dataManager_1.default.getInstance();
const dataListener = dataListener_1.default.getInstance();
;
class Unread {
}
exports.Unread = Unread;
;
class ChatsLogComponent {
    constructor(_convertDateService) {
        this.chatslog = {};
        this.unreadMessageMap = new Map();
        this.chatlog_count = 0;
        this.chatListeners = new Array();
        this._isReady = false;
        this.convertDateService = _convertDateService;
        dataListener.addRoomAccessListenerImp(this);
        console.log("ChatsLogComponent : constructor");
    }
    getChatsLog() {
        return this.chatslog;
    }
    getUnreadMessageMap() {
        return this.unreadMessageMap;
    }
    addUnreadMessage(unread) {
        this.unreadMessageMap.set(unread.rid, unread);
    }
    getUnreadItem(room_id) {
        return this.unreadMessageMap.get(room_id);
    }
    addOnChatListener(listener) {
        this.chatListeners.push(listener);
    }
    onChat(dataEvent) {
        console.log("ChatsLogComponent.onChat");
        //<!-- Provide chatslog service.
        this.chatListeners.map((v, i, a) => {
            v(dataEvent);
        });
    }
    onAccessRoom(dataEvent) {
        let self = this;
        let roomAccess = dataEvent.roomAccess;
        dataManager.roomDAL.get().then((data) => {
            addRoomData(data);
        }).catch(err => {
            done();
        });
        const addRoomData = (rooms) => {
            async.map(roomAccess, function iterator(item, resultCallback) {
                if (!rooms && !rooms.has(item.roomId)) {
                    resultCallback(null, null);
                }
                else {
                    let roomInfo = rooms.get(item.roomId);
                    dataManager.addGroup(roomInfo);
                    resultCallback(null, null);
                }
            }, (err, results) => {
                done();
            });
        };
        const done = () => {
            self._isReady = true;
            if (!!self.onReady)
                self.onReady();
        };
    }
    onUpdatedLastAccessTime(dataEvent) {
        console.log("onUpdatedLastAccessTime", JSON.stringify(dataEvent));
        if (!!this.updatedLastAccessTimeEvent) {
            this.updatedLastAccessTimeEvent(dataEvent);
        }
    }
    onAddRoomAccess(dataEvent) {
        console.warn("ChatsLogComponent.onAddRoomAccess", JSON.stringify(dataEvent));
        if (!!this.addNewRoomAccessEvent) {
            this.addNewRoomAccessEvent(dataEvent);
        }
    }
    onUpdateMemberInfoInProjectBase(dataEvent) {
        console.warn("ChatsLogComponent.onUpdateMemberInfoInProjectBase", JSON.stringify(dataEvent));
    }
    onEditedGroupMember(dataEvent) {
        console.warn("ChatsLogComponent.onEditedGroupMember", JSON.stringify(dataEvent));
    }
    getUnreadMessages(token, roomAccess, callback) {
        let self = this;
        let unreadLogs = new Array();
        async.mapSeries(roomAccess, function iterator(item, cb) {
            if (!!item.roomId && !!item.accessTime) {
                let msg = {};
                msg["token"] = token;
                msg["roomId"] = item.roomId;
                msg["lastAccessTime"] = item.accessTime.toString();
                server.getUnreadMsgOfRoom(msg, function res(err, res) {
                    if (err || res === null) {
                        console.warn("getUnreadMsgOfRoom: ", err);
                    }
                    else {
                        if (res.code === httpStatusCode_1.default.success) {
                            let unread = JSON.parse(JSON.stringify(res.data));
                            unread.rid = item.roomId;
                            unreadLogs.push(unread);
                        }
                    }
                    cb(null, null);
                });
            }
            else {
                cb(null, null);
            }
        }, function done(err) {
            console.log("getUnreadMessages from your roomAccess is done.");
            callback(null, unreadLogs);
        });
    }
    getUnreadMessage(token, roomAccess, callback) {
        let msg = {};
        msg["token"] = token;
        msg["roomId"] = roomAccess.roomId;
        msg["lastAccessTime"] = roomAccess.accessTime.toString();
        server.getUnreadMsgOfRoom(msg, function res(err, res) {
            console.log("getUnreadMsgOfRoom: ", JSON.stringify(res));
            if (err || res === null) {
                callback(err, null);
            }
            else {
                if (res.code === httpStatusCode_1.default.success) {
                    let unread = JSON.parse(JSON.stringify(res.data));
                    unread.rid = roomAccess.roomId;
                    callback(null, unread);
                }
            }
        });
    }
    getRoomInfo(room_id, callback) {
        let self = this;
        let msg = {};
        msg["token"] = dataManager.getSessionToken();
        msg["roomId"] = room_id;
        server.getRoomInfo(msg, function (err, res) {
            if (res.code === httpStatusCode_1.default.success) {
                let roomInfo = JSON.parse(JSON.stringify(res.data));
                if (roomInfo.type === DataModels.RoomType.privateChat) {
                    let targetMemberId = "";
                    roomInfo.members.some((member) => {
                        if (!dataManager.isMySelf(member.id)) {
                            targetMemberId = member.id;
                            return true;
                        }
                    });
                    let contactProfile = dataManager.getContactProfile(targetMemberId);
                    if (contactProfile == null) {
                        roomInfo.name = "EMPTY ROOM";
                    }
                    else {
                        roomInfo.name = contactProfile.displayname;
                        roomInfo.image = contactProfile.image;
                    }
                }
                else {
                    console.warn("OMG: the god only know. May be group status is not active.");
                }
                dataManager.addGroup(roomInfo);
                dataManager.roomDAL.get().then((roomsInfos) => {
                    if (roomsInfos instanceof Map) {
                        save();
                    }
                    else {
                        roomsInfos = new Map();
                        save();
                    }
                    function save() {
                        roomsInfos.set(roomInfo._id, roomInfo);
                        dataManager.roomDAL.save(roomsInfos);
                    }
                });
                callback(null, roomInfo);
            }
            else {
                callback("Cannot get roomInfo", null);
            }
        });
    }
    getRoomsInfo() {
        let self = this;
        let results = new Map();
        this.unreadMessageMap.forEach((value, key, map) => {
            let roomInfo = dataManager.getGroup(value.rid);
            if (!!roomInfo) {
                if (roomInfo.type === DataModels.RoomType.privateChat) {
                    let targetMemberId = "";
                    roomInfo.members.some((member) => {
                        if (!dataManager.isMySelf(member.id)) {
                            targetMemberId = member.id;
                            return true;
                        }
                    });
                    let contactProfile = dataManager.getContactProfile(targetMemberId);
                    if (contactProfile == null) {
                        roomInfo.name = "EMPTY ROOM";
                    }
                    else {
                        roomInfo.name = contactProfile.displayname;
                        roomInfo.image = contactProfile.image;
                    }
                }
                dataManager.addGroup(roomInfo);
                self.organizeChatLogMap(value, roomInfo, function done() {
                    results.set(roomInfo._id, roomInfo);
                });
            }
            else {
                console.warn("Can't find roomInfo from persisted data: ", value.rid);
                let msg = {};
                msg["token"] = dataManager.getSessionToken();
                msg["roomId"] = value.rid;
                server.getRoomInfo(msg, function (err, res) {
                    if (res.code === httpStatusCode_1.default.success) {
                        let roomInfo = JSON.parse(JSON.stringify(res.data));
                        if (roomInfo.type === DataModels.RoomType.privateChat) {
                            let targetMemberId = "";
                            roomInfo.members.some((member) => {
                                if (!dataManager.isMySelf(member.id)) {
                                    targetMemberId = member.id;
                                    return true;
                                }
                            });
                            let contactProfile = dataManager.getContactProfile(targetMemberId);
                            if (contactProfile == null) {
                                roomInfo.name = "EMPTY ROOM";
                            }
                            else {
                                roomInfo.name = contactProfile.displayname;
                                roomInfo.image = contactProfile.image;
                            }
                        }
                        else {
                            console.warn("OMG: the god only know. May be group status is not active.");
                        }
                        dataManager.addGroup(roomInfo);
                        self.organizeChatLogMap(value, roomInfo, function done() {
                            results.set(roomInfo._id, roomInfo);
                        });
                    }
                    else {
                        console.warn("Fail to get room info of room %s", value.rid, res.message);
                    }
                });
            }
        });
        dataManager.roomDAL.save(results);
        console.log("getRoomsInfo Completed.");
        if (this.getRoomsInfoCompleteEvent())
            this.getRoomsInfoCompleteEvent();
    }
    organizeChatLogMap(unread, roomInfo, done) {
        let self = this;
        let log = new chatLog_1.default(roomInfo);
        log.setNotiCount(unread.count);
        if (!!unread.message) {
            log.setLastMessageTime(unread.message.createTime.toString());
            let contact = dataManager.getContactProfile(unread.message.sender);
            let sender = (contact != null) ? contact.displayname : "";
            if (unread.message.body != null) {
                let displayMsg = unread.message.body;
                switch (`${unread.message.type}`) {
                    case DataModels.ContentType[DataModels.ContentType.Text]:
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
                    case DataModels.ContentType[DataModels.ContentType.Sticker]:
                        displayMsg = sender + " sent a sticker.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Voice]:
                        displayMsg = sender + " sent a voice message.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Image]:
                        displayMsg = sender + " sent a image.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Video]:
                        displayMsg = sender + " sent a video.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Location]:
                        displayMsg = sender + " sent a location.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.File]:
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
    }
    setLogProp(log, displayMessage, callback) {
        log.setLastMessage(displayMessage);
        callback(log);
    }
    addChatLog(chatLog, done) {
        console.log("Log", chatLog);
        this.chatslog[chatLog.id] = chatLog;
        done();
    }
    checkRoomInfo(unread) {
        return new Promise((resolve, rejected) => {
            let roomInfo = dataManager.getGroup(unread.rid);
            if (!roomInfo) {
                console.warn("No have roomInfo in room store.", roomInfo);
                this.getRoomInfo(unread.rid, (err, res) => {
                    if (!!res) {
                        this.organizeChatLogMap(unread, res, () => {
                            resolve();
                        });
                    }
                    else {
                        rejected();
                    }
                });
            }
            else {
                console.log("organize chats log of room: ", roomInfo.name);
                this.organizeChatLogMap(unread, roomInfo, () => {
                    resolve();
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
        this.unreadMessageMap.forEach((value, key) => {
            let count = value.count;
            this.chatlog_count += count;
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatsLogComponent;
