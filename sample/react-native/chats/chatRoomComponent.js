"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const async = require("async");
const BackendFactory_1 = require("./BackendFactory");
const serverImplemented_1 = require("../libs/stalk/serverImplemented");
const serverEventListener_1 = require("../libs/stalk/serverEventListener");
const messageDALFactory_1 = require("../libs/chitchat/dataAccessLayer/messageDALFactory");
const secureServiceFactory_1 = require("../libs/chitchat/services/secureServiceFactory");
const ChatDataModels_1 = require("./models/ChatDataModels");
const config_1 = require("../configs/config");
let serverImp = null;
class ChatRoomComponent {
    constructor() {
        this.chatMessages = [];
        this.secure = secureServiceFactory_1.default.getService();
        this.messageDAL = messageDALFactory_1.default.getObject();
        this.chatRoomApi = BackendFactory_1.default.getInstance().getChatApi();
        BackendFactory_1.default.getInstance().getServer().then(server => {
            serverImp = server;
        }).catch(err => {
        });
    }
    static getInstance() {
        if (!ChatRoomComponent.instance) {
            ChatRoomComponent.instance = new ChatRoomComponent();
        }
        return ChatRoomComponent.instance;
    }
    getRoomId() {
        return this.roomId;
    }
    setRoomId(rid) {
        this.roomId = rid;
    }
    onChat(chatMessage) {
        let self = this;
        if (this.roomId === chatMessage.rid) {
            if (chatMessage.type.toString() === ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text]) {
                if (config_1.default.appConfig.encryption == true) {
                    self.secure.decryptWithSecureRandom(chatMessage.body, (err, res) => {
                        if (!err) {
                            chatMessage.body = res;
                            self.chatMessages.push(chatMessage);
                            self.messageDAL.saveData(self.roomId, self.chatMessages);
                            if (!!this.chatroomDelegate)
                                this.chatroomDelegate(serverEventListener_1.default.ON_CHAT, chatMessage);
                        }
                        else {
                            console.log(err, res);
                            self.chatMessages.push(chatMessage);
                            self.messageDAL.saveData(self.roomId, self.chatMessages);
                            if (!!this.chatroomDelegate)
                                this.chatroomDelegate(serverEventListener_1.default.ON_CHAT, chatMessage);
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
    }
    onLeaveRoom(data) {
    }
    onRoomJoin(data) {
    }
    onMessageRead(dataEvent) {
        console.log("onMessageRead", JSON.stringify(dataEvent));
        let self = this;
        let newMsg = JSON.parse(JSON.stringify(dataEvent));
        let promise = new Promise(function (resolve, reject) {
            self.chatMessages.some(function callback(value) {
                if (value._id === newMsg._id) {
                    value.readers = newMsg.readers;
                    if (!!self.chatroomDelegate)
                        self.chatroomDelegate(serverEventListener_1.default.ON_MESSAGE_READ, null);
                    resolve();
                    return true;
                }
            });
        }).then((value) => {
            self.messageDAL.saveData(self.roomId, self.chatMessages);
        });
    }
    onGetMessagesReaders(dataEvent) {
        console.log('onGetMessagesReaders', dataEvent);
        let self = this;
        let myMessagesArr = JSON.parse(JSON.stringify(dataEvent.data));
        self.chatMessages.forEach((originalMsg, id, arr) => {
            if (BackendFactory_1.default.getInstance().dataManager.isMySelf(originalMsg.sender)) {
                myMessagesArr.some((myMsg, index, array) => {
                    if (originalMsg._id === myMsg._id) {
                        originalMsg.readers = myMsg.readers;
                        return true;
                    }
                });
            }
        });
        self.messageDAL.saveData(self.roomId, self.chatMessages);
    }
    getPersistentMessage(rid, done) {
        var self = this;
        self.messageDAL.getData(rid, (err, messages) => {
            if (messages !== null) {
                let chats = messages.slice(0);
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
                }, (err, results) => {
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
    }
    getNewerMessageRecord(callback) {
        let self = this;
        let lastMessageTime = new Date();
        let promise = new Promise(function promise(resolve, reject) {
            if (self.chatMessages[self.chatMessages.length - 1] != null) {
                lastMessageTime = self.chatMessages[self.chatMessages.length - 1].createTime;
                resolve();
            }
            else {
                let roomAccess = BackendFactory_1.default.getInstance().dataManager.getRoomAccess();
                async.some(roomAccess, (item, cb) => {
                    if (item.roomId === self.roomId) {
                        lastMessageTime = item.accessTime;
                        cb(true);
                    }
                    else
                        cb(false);
                }, (result) => {
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
        promise.then((value) => {
            self.getNewerMessageFromNet(lastMessageTime, callback);
        });
        promise.catch(() => {
            console.warn("this room_id is not contain in roomAccess list.");
            self.getNewerMessageFromNet(lastMessageTime, callback);
        });
    }
    getNewerMessageFromNet(lastMessageTime, callback) {
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
                        self.messageDAL.saveData(self.roomId, self.chatMessages, (err, result) => {
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
    }
    getOlderMessageChunk(callback) {
        let self = this;
        self.getTopEdgeMessageTime(function done(err, res) {
            self.chatRoomApi.getOlderMessageChunk(self.roomId, res, function response(err, res) {
                //@ todo.
                /**
                 * Merge messages record to chatMessages array.
                 * Never save message to persistend layer.
                 */
                let datas = [];
                datas = res.data;
                let clientMessages = self.chatMessages.slice(0);
                let mergedArray = [];
                if (datas.length > 0) {
                    let messages = JSON.parse(JSON.stringify(datas));
                    mergedArray = messages.concat(clientMessages);
                }
                let resultsArray = [];
                async.map(mergedArray, function iterator(item, cb) {
                    let hasMessage = resultsArray.some(function itor(value, id, arr) {
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
    }
    checkOlderMessages(callback) {
        let self = this;
        self.getTopEdgeMessageTime(function done(err, res) {
            self.chatRoomApi.checkOlderMessagesCount(self.roomId, res, function response(err, res) {
                callback(err, res);
            });
        });
    }
    getTopEdgeMessageTime(callback) {
        let self = this;
        let topEdgeMessageTime = null;
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
    }
    compareMessage(a, b) {
        if (a.createTime > b.createTime) {
            return 1;
        }
        if (a.createTime < b.createTime) {
            return -1;
        }
        // a must be equal to b
        return 0;
    }
    getMessage(chatId, Chats, callback) {
        let self = this;
        let myProfile = BackendFactory_1.default.getInstance().dataManager.getMyProfile();
        let chatLog = localStorage.getItem(myProfile._id + '_' + chatId);
        let promise = new Promise(function (resolve, reject) {
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
                        arr_fromLog.map((log, i, a) => {
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
    }
    updateReadMessages() {
        let self = this;
        async.map(self.chatMessages, function itorator(message, resultCb) {
            if (!dataManager.isMySelf(message.sender)) {
                self.chatRoomApi.updateMessageReader(message._id, message.rid);
            }
            resultCb(null, null);
        }, function done(err) {
            //@ done.
        });
    }
    updateWhoReadMyMessages() {
        let self = this;
        self.getTopEdgeMessageTime((err, res) => {
            self.chatRoomApi.getMessagesReaders(res);
        });
    }
    getMemberProfile(member, callback) {
        serverImplemented_1.default.getInstance().getMemberProfile(member.id, callback);
    }
    dispose() {
        ChatRoomComponent.instance = null;
    }
}
exports.default = ChatRoomComponent;
