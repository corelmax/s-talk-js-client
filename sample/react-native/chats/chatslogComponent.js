"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var async = require("async");
var DataModels = require("./models/ChatDataModels");
var chatLog_1 = require("./models/chatLog");
var BackendFactory_1 = require("./BackendFactory");
var httpStatusCode_1 = require("../libs/stalk/utils/httpStatusCode");
;
;
var Unread = (function () {
    function Unread() {
    }
    return Unread;
}());
exports.Unread = Unread;
;
var ChatsLogComponent = (function () {
    function ChatsLogComponent(_convertDateService) {
        var _this = this;
        this.serverImp = null;
        this.dataManager = null;
        this.dataListener = null;
        this.chatslog = {};
        this.unreadMessageMap = new Map();
        this.chatlog_count = 0;
        this.chatListeners = new Array();
        this._isReady = false;
        this.convertDateService = _convertDateService;
        this.dataManager = BackendFactory_1.default.getInstance().dataManager;
        this.dataListener = BackendFactory_1.default.getInstance().dataListener;
        this.dataListener.addRoomAccessListenerImp(this);
        BackendFactory_1.default.getInstance().getServer().then(function (server) {
            _this.serverImp = server;
        }).catch(function (err) {
            console.log(err);
        });
        console.log("ChatsLogComponent : constructor");
    }
    ChatsLogComponent.prototype.getChatsLog = function () {
        return this.chatslog;
    };
    ChatsLogComponent.prototype.getUnreadMessageMap = function () {
        return this.unreadMessageMap;
    };
    ChatsLogComponent.prototype.addUnreadMessage = function (unread) {
        this.unreadMessageMap.set(unread.rid, unread);
    };
    ChatsLogComponent.prototype.getUnreadItem = function (room_id) {
        return this.unreadMessageMap.get(room_id);
    };
    ChatsLogComponent.prototype.addOnChatListener = function (listener) {
        this.chatListeners.push(listener);
    };
    ChatsLogComponent.prototype.onChat = function (dataEvent) {
        console.log("ChatsLogComponent.onChat");
        //<!-- Provide chatslog service.
        this.chatListeners.map(function (v, i, a) {
            v(dataEvent);
        });
    };
    ChatsLogComponent.prototype.onAccessRoom = function (dataEvent) {
        var self = this;
        var roomAccess = dataEvent.roomAccess;
        this.dataManager.roomDAL.get().then(function (data) {
            addRoomData(data);
        }).catch(function (err) {
            done();
        });
        var addRoomData = function (rooms) {
            async.map(roomAccess, function iterator(item, resultCallback) {
                if (!rooms && !rooms.has(item.roomId)) {
                    resultCallback(null, null);
                }
                else {
                    var roomInfo = rooms.get(item.roomId);
                    self.dataManager.addGroup(roomInfo);
                    resultCallback(null, null);
                }
            }, function (err, results) {
                done();
            });
        };
        var done = function () {
            self._isReady = true;
            if (!!self.onReady)
                self.onReady();
        };
    };
    ChatsLogComponent.prototype.onUpdatedLastAccessTime = function (dataEvent) {
        console.log("onUpdatedLastAccessTime", JSON.stringify(dataEvent));
        if (!!this.updatedLastAccessTimeEvent) {
            this.updatedLastAccessTimeEvent(dataEvent);
        }
    };
    ChatsLogComponent.prototype.onAddRoomAccess = function (dataEvent) {
        console.warn("ChatsLogComponent.onAddRoomAccess", JSON.stringify(dataEvent));
        if (!!this.addNewRoomAccessEvent) {
            this.addNewRoomAccessEvent(dataEvent);
        }
    };
    ChatsLogComponent.prototype.onUpdateMemberInfoInProjectBase = function (dataEvent) {
        console.warn("ChatsLogComponent.onUpdateMemberInfoInProjectBase", JSON.stringify(dataEvent));
    };
    ChatsLogComponent.prototype.onEditedGroupMember = function (dataEvent) {
        console.warn("ChatsLogComponent.onEditedGroupMember", JSON.stringify(dataEvent));
    };
    ChatsLogComponent.prototype.getUnreadMessages = function (token, roomAccess, callback) {
        var self = this;
        var unreadLogs = new Array();
        async.mapSeries(roomAccess, function iterator(item, cb) {
            if (!!item.roomId && !!item.accessTime) {
                var msg = {};
                msg["token"] = token;
                msg["roomId"] = item.roomId;
                msg["lastAccessTime"] = item.accessTime.toString();
                self.serverImp.getUnreadMsgOfRoom(msg, function res(err, res) {
                    if (err || res === null) {
                        console.warn("getUnreadMsgOfRoom: ", err);
                    }
                    else {
                        if (res.code === httpStatusCode_1.default.success) {
                            var unread = JSON.parse(JSON.stringify(res.data));
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
    };
    ChatsLogComponent.prototype.getUnreadMessage = function (token, roomAccess, callback) {
        var msg = {};
        msg["token"] = token;
        msg["roomId"] = roomAccess.roomId;
        msg["lastAccessTime"] = roomAccess.accessTime.toString();
        this.serverImp.getUnreadMsgOfRoom(msg, function res(err, res) {
            console.log("getUnreadMsgOfRoom: ", JSON.stringify(res));
            if (err || res === null) {
                callback(err, null);
            }
            else {
                if (res.code === httpStatusCode_1.default.success) {
                    var unread = JSON.parse(JSON.stringify(res.data));
                    unread.rid = roomAccess.roomId;
                    callback(null, unread);
                }
            }
        });
    };
    ChatsLogComponent.prototype.updatePersistRoomInfo = function (roomInfo) {
        var self = this;
        this.dataManager.roomDAL.get().then(function (roomsInfos) {
            if (roomsInfos instanceof Map) {
                save();
            }
            else {
                roomsInfos = new Map();
                save();
            }
            function save() {
                roomsInfos.set(roomInfo._id, roomInfo);
                self.dataManager.roomDAL.save(roomsInfos);
            }
        });
    };
    ChatsLogComponent.prototype.decorateRoomInfoData = function (roomInfo) {
        var _this = this;
        if (roomInfo.type === DataModels.RoomType.privateChat) {
            var others = roomInfo.members.filter(function (value) { return !_this.dataManager.isMySelf(value.id); });
            if (others.length > 0) {
                var contactProfile = this.dataManager.getContactProfile(others[0].id);
                if (contactProfile == null) {
                    roomInfo.name = "EMPTY ROOM";
                }
                else {
                    roomInfo.name = contactProfile.displayname;
                    roomInfo.image = contactProfile.image;
                }
            }
        }
        return roomInfo;
    };
    ChatsLogComponent.prototype.getRoomInfo = function (room_id, callback) {
        var self = this;
        var msg = {};
        msg["token"] = self.dataManager.getSessionToken();
        msg["roomId"] = room_id;
        self.serverImp.getRoomInfo(msg, function (err, res) {
            console.log("getRoomInfo result", err, res);
            if (res.code === httpStatusCode_1.default.success) {
                var roomInfo = JSON.parse(JSON.stringify(res.data));
                var room = self.decorateRoomInfoData(roomInfo);
                self.dataManager.addGroup(room);
                callback(null, room);
            }
            else {
                callback("Cannot get roomInfo", null);
            }
        });
    };
    ChatsLogComponent.prototype.getRoomsInfo = function () {
        var _this = this;
        var self = this;
        var results = new Map();
        this.unreadMessageMap.forEach(function (value, key, map) {
            var roomInfo = self.dataManager.getGroup(value.rid);
            if (!!roomInfo) {
                var room_1 = self.decorateRoomInfoData(roomInfo);
                self.dataManager.addGroup(room_1);
                self.organizeChatLogMap(value, room_1, function done() {
                    results.set(room_1._id, room_1);
                });
            }
            else {
                console.warn("Can't find roomInfo from persisted data: ", value.rid);
                _this.getRoomInfo(value.rid, function (err, room) {
                    if (!!room) {
                        _this.updatePersistRoomInfo(room);
                        self.organizeChatLogMap(value, room, function done() {
                            results.set(room._id, room);
                        });
                    }
                });
            }
        });
        self.dataManager.roomDAL.save(results);
        console.log("getRoomsInfo Completed.");
        if (this.getRoomsInfoCompleteEvent())
            this.getRoomsInfoCompleteEvent();
    };
    ChatsLogComponent.prototype.organizeChatLogMap = function (unread, roomInfo, done) {
        var self = this;
        var log = new chatLog_1.default(roomInfo);
        log.setNotiCount(unread.count);
        if (!!unread.message) {
            log.setLastMessageTime(unread.message.createTime.toString());
            var contact = self.dataManager.getContactProfile(unread.message.sender);
            var sender = (contact != null) ? contact.displayname : "";
            if (unread.message.body != null) {
                var displayMsg = unread.message.body;
                switch ("" + unread.message.type) {
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
            var displayMsg = "Start Chatting Now!";
            self.setLogProp(log, displayMsg, function (log) {
                self.addChatLog(log, done);
            });
        }
    };
    ChatsLogComponent.prototype.setLogProp = function (log, displayMessage, callback) {
        log.setLastMessage(displayMessage);
        callback(log);
    };
    ChatsLogComponent.prototype.addChatLog = function (chatLog, done) {
        this.chatslog[chatLog.id] = chatLog;
        done();
    };
    ChatsLogComponent.prototype.checkRoomInfo = function (unread) {
        var _this = this;
        return new Promise(function (resolve, rejected) {
            var roomInfo = _this.dataManager.getGroup(unread.rid);
            if (!roomInfo) {
                console.warn("No have roomInfo in room store.", unread.rid);
                _this.getRoomInfo(unread.rid, function (err, room) {
                    if (!!room) {
                        _this.updatePersistRoomInfo(room);
                        _this.organizeChatLogMap(unread, room, function () {
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
                _this.organizeChatLogMap(unread, roomInfo, function () {
                    resolve();
                });
            }
        });
    };
    ChatsLogComponent.prototype.getChatsLogCount = function () {
        return this.chatlog_count;
    };
    ChatsLogComponent.prototype.increaseChatsLogCount = function (num) {
        this.chatlog_count += num;
    };
    ChatsLogComponent.prototype.decreaseChatsLogCount = function (num) {
        this.chatlog_count -= num;
    };
    ChatsLogComponent.prototype.calculateChatsLogCount = function () {
        var _this = this;
        this.chatlog_count = 0;
        this.unreadMessageMap.forEach(function (value, key) {
            var count = value.count;
            _this.chatlog_count += count;
        });
    };
    return ChatsLogComponent;
}());
exports.default = ChatsLogComponent;
