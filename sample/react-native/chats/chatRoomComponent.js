"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var async = require("async");
var BackendFactory_1 = require("./BackendFactory");
var serverImplemented_1 = require("../libs/stalk/serverImplemented");
var serverEventListener_1 = require("../libs/stalk/serverEventListener");
var messageDALFactory_1 = require("../libs/chitchat/dataAccessLayer/messageDALFactory");
var secureServiceFactory_1 = require("../libs/chitchat/services/secureServiceFactory");
var ChatDataModels_1 = require("./models/ChatDataModels");
var config_1 = require("../configs/config");
var serverImp = null;
var ChatRoomComponent = /** @class */ (function () {
    function ChatRoomComponent() {
        this.chatMessages = [];
        this.secure = secureServiceFactory_1.default.getService();
        this.messageDAL = messageDALFactory_1.default.getObject();
        this.chatRoomApi = BackendFactory_1.default.getInstance().getChatApi();
        BackendFactory_1.default.getInstance().getServer().then(function (server) {
            serverImp = server;
        }).catch(function (err) {
        });
    }
    ChatRoomComponent.getInstance = function () {
        if (!ChatRoomComponent.instance) {
            ChatRoomComponent.instance = new ChatRoomComponent();
        }
        return ChatRoomComponent.instance;
    };
    ChatRoomComponent.prototype.getRoomId = function () {
        return this.roomId;
    };
    ChatRoomComponent.prototype.setRoomId = function (rid) {
        this.roomId = rid;
    };
    ChatRoomComponent.prototype.onChat = function (chatMessage) {
        var _this = this;
        var self = this;
        if (this.roomId === chatMessage.rid) {
            if (chatMessage.type.toString() === ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text]) {
                if (config_1.default.appConfig.encryption == true) {
                    self.secure.decryptWithSecureRandom(chatMessage.body, function (err, res) {
                        if (!err) {
                            chatMessage.body = res;
                            self.chatMessages.push(chatMessage);
                            self.messageDAL.saveData(self.roomId, self.chatMessages);
                            if (!!_this.chatroomDelegate)
                                _this.chatroomDelegate(serverEventListener_1.default.ON_CHAT, chatMessage);
                        }
                        else {
                            console.log(err, res);
                            self.chatMessages.push(chatMessage);
                            self.messageDAL.saveData(self.roomId, self.chatMessages);
                            if (!!_this.chatroomDelegate)
                                _this.chatroomDelegate(serverEventListener_1.default.ON_CHAT, chatMessage);
                        }
                    });
                }
                else {
                    self.chatMessages.push(chatMessage);
                    self.messageDAL.saveData(self.roomId, self.chatMessages);
                    if (!!this.chatroomDelegate)
                        this.chatroomDelegate(serverEventListener_1.default.ON_CHAT, chatMessage);
                }
            }
            else {
                self.chatMessages.push(chatMessage);
                self.messageDAL.saveData(self.roomId, self.chatMessages);
                if (!!this.chatroomDelegate)
                    this.chatroomDelegate(serverEventListener_1.default.ON_CHAT, chatMessage);
            }
        }
        else {
            console.warn("this msg come from other room.");
            if (!!this.outsideRoomDelegete) {
                this.outsideRoomDelegete(serverEventListener_1.default.ON_CHAT, chatMessage);
            }
        }
    };
    ChatRoomComponent.prototype.onLeaveRoom = function (data) {
    };
    ChatRoomComponent.prototype.onRoomJoin = function (data) {
    };
    ChatRoomComponent.prototype.onMessageRead = function (dataEvent) {
        console.log("onMessageRead", JSON.stringify(dataEvent));
        var self = this;
        var newMsg = JSON.parse(JSON.stringify(dataEvent));
        var promise = new Promise(function (resolve, reject) {
            self.chatMessages.some(function callback(value) {
                if (value._id === newMsg._id) {
                    value.readers = newMsg.readers;
                    if (!!self.chatroomDelegate)
                        self.chatroomDelegate(serverEventListener_1.default.ON_MESSAGE_READ, null);
                    resolve();
                    return true;
                }
            });
        }).then(function (value) {
            self.messageDAL.saveData(self.roomId, self.chatMessages);
        });
    };
    ChatRoomComponent.prototype.onGetMessagesReaders = function (dataEvent) {
        console.log('onGetMessagesReaders', dataEvent);
        var self = this;
        var myMessagesArr = JSON.parse(JSON.stringify(dataEvent.data));
        self.chatMessages.forEach(function (originalMsg, id, arr) {
            if (BackendFactory_1.default.getInstance().dataManager.isMySelf(originalMsg.sender)) {
                myMessagesArr.some(function (myMsg, index, array) {
                    if (originalMsg._id === myMsg._id) {
                        originalMsg.readers = myMsg.readers;
                        return true;
                    }
                });
            }
        });
        self.messageDAL.saveData(self.roomId, self.chatMessages);
    };
    ChatRoomComponent.prototype.getPersistentMessage = function (rid, done) {
        var self = this;
        self.messageDAL.getData(rid, function (err, messages) {
            if (messages !== null) {
                var chats = messages.slice(0);
                async.mapSeries(chats, function iterator(item, result) {
                    if (item.type === ChatDataModels_1.ContentType.Text) {
                        if (config_1.default.appConfig.encryption == true) {
                            self.secure.decryptWithSecureRandom(item.body, function (err, res) {
                                if (!err) {
                                    item.body = res;
                                    self.chatMessages.push(item);
                                }
                                else {
                                    self.chatMessages.push(item);
                                }
                                result(null, item);
                            });
                        }
                        else {
                            self.chatMessages.push(item);
                            result(null, item);
                        }
                    }
                    else {
                        self.chatMessages.push(item);
                        result(null, item);
                    }
                }, function (err, results) {
                    console.log("decode chats text completed.", self.chatMessages.length);
                    done(err, messages);
                });
            }
            else {
                self.chatMessages = [];
                console.log("chatMessages", self.chatMessages.length);
                done(err, messages);
            }
        });
    };
    ChatRoomComponent.prototype.getNewerMessageRecord = function (callback) {
        var self = this;
        var lastMessageTime = new Date();
        var promise = new Promise(function promise(resolve, reject) {
            if (self.chatMessages[self.chatMessages.length - 1] != null) {
                lastMessageTime = self.chatMessages[self.chatMessages.length - 1].createTime;
                resolve();
            }
            else {
                var roomAccess = BackendFactory_1.default.getInstance().dataManager.getRoomAccess();
                async.some(roomAccess, function (item, cb) {
                    if (item.roomId === self.roomId) {
                        lastMessageTime = item.accessTime;
                        cb(true);
                    }
                    else
                        cb(false);
                }, function (result) {
                    console.log(result);
                    if (result) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            }
        });
        promise.then(function (value) {
            self.getNewerMessageFromNet(lastMessageTime, callback);
        });
        promise.catch(function () {
            console.warn("this room_id is not contain in roomAccess list.");
            self.getNewerMessageFromNet(lastMessageTime, callback);
        });
    };
    ChatRoomComponent.prototype.getNewerMessageFromNet = function (lastMessageTime, callback) {
        var self = this;
        self.chatRoomApi.getChatHistory(self.roomId, lastMessageTime, function (err, result) {
            var histories = [];
            if (result.code === 200) {
                histories = result.data;
                console.log("Newer message counts.", histories.length);
                if (histories.length > 0) {
                    var messages = JSON.parse(JSON.stringify(histories));
                    async.mapSeries(messages, function (item, cb) {
                        if (item.type.toString() === ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text]) {
                            if (config_1.default.appConfig.encryption == true) {
                                self.secure.decryptWithSecureRandom(item.body, function (err, res) {
                                    if (!err) {
                                        item.body = res;
                                        self.chatMessages.push(item);
                                    }
                                    else {
                                        self.chatMessages.push(item);
                                    }
                                    cb(null, item);
                                });
                            }
                            else {
                                self.chatMessages.push(item);
                                cb(null, item);
                            }
                        }
                        else {
                            self.chatMessages.push(item);
                            cb(null, item);
                        }
                    }, function done(err) {
                        if (!err) {
                            console.log("get newer message completed.");
                        }
                        else {
                            console.error('get newer message error', err);
                        }
                        console.log("chatMessage.Count", self.chatMessages.length);
                        //<!-- Save persistent chats log here.
                        self.messageDAL.saveData(self.roomId, self.chatMessages, function (err, result) {
                            //self.getNewerMessageRecord();
                        });
                        if (callback !== null) {
                            callback(null, result.code);
                        }
                    });
                }
                else {
                    console.log("Have no newer message.");
                    if (callback !== null) {
                        callback(null, result.code);
                    }
                }
            }
            else {
                console.warn("WTF god only know.", result.message);
                if (callback !== null) {
                    callback(null, result.code);
                }
            }
        });
    };
    ChatRoomComponent.prototype.getOlderMessageChunk = function (callback) {
        var self = this;
        self.getTopEdgeMessageTime(function done(err, res) {
            self.chatRoomApi.getOlderMessageChunk(self.roomId, res, function response(err, res) {
                //@ todo.
                /**
                 * Merge messages record to chatMessages array.
                 * Never save message to persistend layer.
                 */
                var datas = [];
                datas = res.data;
                var clientMessages = self.chatMessages.slice(0);
                var mergedArray = [];
                if (datas.length > 0) {
                    var messages = JSON.parse(JSON.stringify(datas));
                    mergedArray = messages.concat(clientMessages);
                }
                var resultsArray = [];
                async.map(mergedArray, function iterator(item, cb) {
                    var hasMessage = resultsArray.some(function itor(value, id, arr) {
                        if (value._id == item._id) {
                            return true;
                        }
                    });
                    if (hasMessage == false) {
                        resultsArray.push(item);
                        cb(null, null);
                    }
                    else {
                        cb(null, null);
                    }
                }, function done(err, results) {
                    resultsArray.sort(self.compareMessage);
                    self.chatMessages = resultsArray.slice(0);
                    callback(err, resultsArray);
                    self.messageDAL.saveData(self.roomId, self.chatMessages);
                });
            });
        });
    };
    ChatRoomComponent.prototype.checkOlderMessages = function (callback) {
        var self = this;
        self.getTopEdgeMessageTime(function done(err, res) {
            self.chatRoomApi.checkOlderMessagesCount(self.roomId, res, function response(err, res) {
                callback(err, res);
            });
        });
    };
    ChatRoomComponent.prototype.getTopEdgeMessageTime = function (callback) {
        var self = this;
        var topEdgeMessageTime = null;
        if (self.chatMessages != null && self.chatMessages.length != 0) {
            if (!!self.chatMessages[0].createTime) {
                topEdgeMessageTime = self.chatMessages[0].createTime;
            }
            else {
                topEdgeMessageTime = new Date();
            }
        }
        else {
            topEdgeMessageTime = new Date();
        }
        console.log('topEdgeMsg:', topEdgeMessageTime, JSON.stringify(self.chatMessages[0]));
        callback(null, topEdgeMessageTime);
    };
    ChatRoomComponent.prototype.compareMessage = function (a, b) {
        if (a.createTime > b.createTime) {
            return 1;
        }
        if (a.createTime < b.createTime) {
            return -1;
        }
        // a must be equal to b
        return 0;
    };
    ChatRoomComponent.prototype.getMessage = function (chatId, Chats, callback) {
        var self = this;
        var myProfile = BackendFactory_1.default.getInstance().dataManager.getMyProfile();
        var chatLog = localStorage.getItem(myProfile._id + '_' + chatId);
        var promise = new Promise(function (resolve, reject) {
            if (!!chatLog) {
                console.log("Local chat history has a data...");
                if (JSON.stringify(chatLog) === "") {
                    self.chatMessages = [];
                    resolve();
                }
                else {
                    var arr_fromLog = JSON.parse(chatLog);
                    if (arr_fromLog === null || arr_fromLog instanceof Array === false) {
                        self.chatMessages = [];
                        resolve();
                    }
                    else {
                        console.log("Decode local chat history for displaying:", arr_fromLog.length);
                        // let count = 0;
                        arr_fromLog.map(function (log, i, a) {
                            var messageImp = log;
                            if (messageImp.type === ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text]) {
                                if (config_1.default.appConfig.encryption == true) {
                                    self.secure.decryptWithSecureRandom(messageImp.body, function (err, res) {
                                        if (!err) {
                                            messageImp.body = res;
                                            self.chatMessages.push(messageImp);
                                        }
                                        else {
                                            //console.log(err, res);
                                            self.chatMessages.push(messageImp);
                                        }
                                    });
                                }
                                else {
                                    self.chatMessages.push(messageImp);
                                }
                            }
                            else {
                                // console.log("item:", count++, log.type);
                                self.chatMessages.push(log);
                            }
                        });
                        resolve();
                    }
                }
            }
            else {
                console.log("Have no local chat history.");
                self.chatMessages = [];
                resolve();
            }
        });
        promise.then(function onFulfilled() {
            console.log("get local history done:");
            serverImp.JoinChatRoomRequest(chatId, function (err, joinRoomRes) {
                if (joinRoomRes.code == 200) {
                    var access = new Date();
                    var roomAccess = self.dataManager.myProfile.roomAccess;
                    async.eachSeries(roomAccess, function iterator(item, cb) {
                        if (item.roomId == chatId) {
                            access = item.accessTime;
                        }
                        cb();
                    }, function done() {
                        self.chatRoomApi.getChatHistory(chatId, access, function (err, result) {
                            var histories = [];
                            if (result.code === 200) {
                                histories = result.data;
                            }
                            else {
                                //console.warn("WTF god only know.", result.message);
                            }
                            var his_length = histories.length;
                            //console.log("new chat log", histories.length);
                            if (his_length > 0) {
                                async.eachSeries(histories, function (item, cb) {
                                    var chatMessageImp = JSON.parse(JSON.stringify(item));
                                    if (chatMessageImp.type === ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text]) {
                                        if (serverImplemented_1.default.getInstance().appConfig.encryption == true) {
                                            self.secure.decryptWithSecureRandom(chatMessageImp.body, function (err, res) {
                                                if (!err) {
                                                    chatMessageImp.body = res;
                                                    self.chatMessages.push(chatMessageImp);
                                                    cb();
                                                }
                                                else {
                                                    //console.warn(err, res);
                                                    cb();
                                                }
                                            });
                                        }
                                        else {
                                            self.chatMessages.push(chatMessageImp);
                                            cb();
                                        }
                                    }
                                    else {
                                        if (item.type == 'File') {
                                            console.log('file');
                                        }
                                        self.chatMessages.push(item);
                                        cb();
                                    }
                                }, function (err) {
                                    Chats.set(self.chatMessages);
                                    localStorage.removeItem(myProfile._id + '_' + chatId);
                                    localStorage.setItem(myProfile._id + '_' + chatId, JSON.stringify(self.chatMessages));
                                    callback(joinRoomRes);
                                });
                            }
                            else {
                                Chats.set(self.chatMessages);
                                callback(joinRoomRes);
                            }
                        });
                    });
                }
                else {
                    callback(joinRoomRes);
                }
            });
        }).catch(function onRejected(reason) {
            console.warn("promiss.onRejected", reason);
        });
    };
    ChatRoomComponent.prototype.updateReadMessages = function () {
        var self = this;
        async.map(self.chatMessages, function itorator(message, resultCb) {
            if (!dataManager.isMySelf(message.sender)) {
                self.chatRoomApi.updateMessageReader(message._id, message.rid);
            }
            resultCb(null, null);
        }, function done(err) {
            //@ done.
        });
    };
    ChatRoomComponent.prototype.updateWhoReadMyMessages = function () {
        var self = this;
        self.getTopEdgeMessageTime(function (err, res) {
            self.chatRoomApi.getMessagesReaders(res);
        });
    };
    ChatRoomComponent.prototype.getMemberProfile = function (member, callback) {
        serverImplemented_1.default.getInstance().getMemberProfile(member.id, callback);
    };
    ChatRoomComponent.prototype.dispose = function () {
        ChatRoomComponent.instance = null;
    };
    return ChatRoomComponent;
}());
exports.default = ChatRoomComponent;
