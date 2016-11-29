/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */

import * as async from 'async';

import { IMessage } from "../libs/stalk/chatRoomApiProvider";
import { IRoomAccessListenerImp } from "./abstracts/IRoomAccessListenerImp";
import * as DataModels from "./models/ChatDataModels";
import ChatLog from "./models/chatLog";
import DataManager from "./dataManager";
import DataListener from "./dataListener";
import BackendFactory from "./BackendFactory";

import HttpCode from "../libs/stalk/utils/httpStatusCode";
import { IDictionary } from "../libs/stalk/serverImplemented";

const server = BackendFactory.getInstance().getServer();
const dataManager = DataManager.getInstance();
const dataListener = DataListener.getInstance();

export type ChatLogMap = { [key: string]: ChatLog };
export interface IUnread { message: DataModels.Message; rid: string; count: number };
export class Unread { message: DataModels.Message; rid: string; count: number };

export default class ChatsLogComponent implements IRoomAccessListenerImp {
    private convertDateService;
    private chatslog: ChatLogMap = {};
    public getChatsLog(): ChatLogMap {
        return this.chatslog;
    }

    private unreadMessageMap: Map<string, IUnread> = new Map();
    public getUnreadMessageMap(): Map<string, IUnread> {
        return this.unreadMessageMap;
    }
    public addUnreadMessage(unread: IUnread) {
        this.unreadMessageMap.set(unread.rid, unread);
    }
    public getUnreadItem(room_id: string): IUnread {
        return this.unreadMessageMap.get(room_id);
    }

    private chatlog_count: number = 0;
    public _isReady: boolean;
    public onReady: () => void;

    public getRoomsInfoCompleteEvent: () => void;

    constructor(_convertDateService?) {
        this._isReady = false;
        this.convertDateService = _convertDateService;

        dataListener.addRoomAccessListenerImp(this);

        console.log("ChatsLogComponent : constructor");
    }


    private chatListeners = new Array<(param) => void>();
    public addOnChatListener(listener) {
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
        let roomAccess: DataModels.RoomAccessData[] = dataEvent.roomAccess;

        dataManager.roomDAL.get().then((data: Map<string, DataModels.Room>) => {
            addRoomData(data);
        }).catch(err => {
            done();
        });

        const addRoomData = (rooms: Map<string, DataModels.Room>) => {
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
                done()
            });
        }

        const done = () => {
            self._isReady = true;

            if (!!self.onReady)
                self.onReady();
        }
    }

    public updatedLastAccessTimeEvent: (data) => void;
    onUpdatedLastAccessTime(dataEvent) {
        console.log("onUpdatedLastAccessTime", JSON.stringify(dataEvent));

        if (!!this.updatedLastAccessTimeEvent) {
            this.updatedLastAccessTimeEvent(dataEvent);
        }
    }
    public addNewRoomAccessEvent: (data) => void;
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
    public getUnreadMessages(token: string, roomAccess: DataModels.RoomAccessData[], callback: (err, logsData: Array<IUnread>) => void) {
        let self = this;
        let unreadLogs = new Array<IUnread>();
        async.mapSeries(roomAccess, function iterator(item, cb) {
            if (!!item.roomId && !!item.accessTime) {
                let msg: IDictionary = {};
                msg["token"] = token;
                msg["roomId"] = item.roomId;
                msg["lastAccessTime"] = item.accessTime.toString();
                server.getUnreadMsgOfRoom(msg, function res(err, res) {
                    if (err || res === null) {
                        console.warn("getUnreadMsgOfRoom: ", err);
                    }
                    else {
                        if (res.code === HttpCode.success) {
                            let unread: IUnread = JSON.parse(JSON.stringify(res.data));
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

    public getUnreadMessage(token: string, roomAccess: DataModels.RoomAccessData, callback: (err, res: IUnread) => void) {
        let msg: IDictionary = {};
        msg["token"] = token;
        msg["roomId"] = roomAccess.roomId;
        msg["lastAccessTime"] = roomAccess.accessTime.toString();
        server.getUnreadMsgOfRoom(msg, function res(err, res) {
            console.log("getUnreadMsgOfRoom: ", JSON.stringify(res));
            if (err || res === null) {
                callback(err, null);
            }
            else {
                if (res.code === HttpCode.success) {
                    let unread: IUnread = JSON.parse(JSON.stringify(res.data));
                    unread.rid = roomAccess.roomId;

                    callback(null, unread);
                }
            }
        });
    }

    private getRoomInfo(room_id: string, callback: (err, res: DataModels.Room) => void) {
        let self = this;

        let msg: IDictionary = {};
        msg["token"] = dataManager.getSessionToken();
        msg["roomId"] = room_id;
        server.getRoomInfo(msg, function (err, res) {
            if (res.code === HttpCode.success) {
                let roomInfo: DataModels.Room = JSON.parse(JSON.stringify(res.data));
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
                dataManager.roomDAL.get().then((roomsInfos: Map<string, DataModels.Room>) => {
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

    public getRoomsInfo() {
        let self = this;
        let results = new Map<string, DataModels.Room>();

        this.unreadMessageMap.forEach((value, key, map) => {
            let roomInfo: DataModels.Room = dataManager.getGroup(value.rid);
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

                let msg: IDictionary = {};
                msg["token"] = dataManager.getSessionToken();
                msg["roomId"] = value.rid;
                server.getRoomInfo(msg, function (err, res) {
                    if (res.code === HttpCode.success) {
                        let roomInfo: DataModels.Room = JSON.parse(JSON.stringify(res.data));
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

    private organizeChatLogMap(unread: IUnread, roomInfo: DataModels.Room, done) {
        let self = this;
        let log = new ChatLog(roomInfo);
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

    private setLogProp(log: ChatLog, displayMessage, callback: (log: ChatLog) => void) {
        log.setLastMessage(displayMessage);

        callback(log);
    }

    private addChatLog(chatLog: ChatLog, done: () => void) {
        console.log("Log", chatLog);

        this.chatslog[chatLog.id] = chatLog;
        done();
    }

    public checkRoomInfo(unread: IUnread): Promise<any> {
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

    public getChatsLogCount(): number {
        return this.chatlog_count;
    }
    public increaseChatsLogCount(num: number) {
        this.chatlog_count += num;
    }
    public decreaseChatsLogCount(num: number) {
        this.chatlog_count -= num;
    }
    public calculateChatsLogCount() {
        this.unreadMessageMap.forEach((value, key) => {
            let count = value.count;
            this.chatlog_count += count;
        });
    }
}