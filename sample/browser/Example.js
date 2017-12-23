"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
var StalkCodeExam;
(function (StalkCodeExam) {
    /**
     * Preparing connection...
     */
    class Factory {
        constructor(host, port) {
            this.stalk = index_1.stalkjs.create(host, port);
        }
        stalkInit() {
            return __awaiter(this, void 0, void 0, function* () {
                let socket = yield index_1.stalkjs.init(this.stalk);
                return socket;
            });
        }
        handshake(uid) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // @ get connector server.
                    let msg = {};
                    msg["uid"] = uid;
                    msg["x-api-key"] = ""; /* your api key*/
                    ;
                    let connector = yield index_1.stalkjs.geteEnter(this.stalk, msg);
                    let params = { host: connector.host, port: connector.port, reconnect: false };
                    yield index_1.stalkjs.handshake(this.stalk, params);
                    return yield connector;
                }
                catch (ex) {
                    throw new Error("handshake fail: " + ex.message);
                }
            });
        }
        checkIn(user) {
            return __awaiter(this, void 0, void 0, function* () {
                let msg = {};
                msg["user"] = user;
                msg["x-api-key"] = ""; /* your api key*/
                ;
                let result = yield index_1.stalkjs.checkIn(this.stalk, msg);
                return result;
            });
        }
        checkOut() {
            return __awaiter(this, void 0, void 0, function* () {
                yield index_1.stalkjs.checkOut(this.stalk);
            });
        }
    }
    StalkCodeExam.Factory = Factory;
    /**
     * Listenning for messages...
     */
    class ServerListener {
        constructor(socket) {
            this.socket = socket;
        }
        addPushListener(obj) {
            this.pushServerListener = obj;
            let self = this;
            self.socket.on(index_1.PushEvents.ON_PUSH, function (data) {
                console.log(index_1.PushEvents.ON_PUSH, JSON.stringify(data));
                self.pushServerListener.onPush(data);
            });
        }
        addServerListener(obj) {
            this.serverListener = obj;
            let self = this;
            // <!-- User -->
            self.socket.on(index_1.StalkEvents.ON_USER_LOGIN, data => {
                console.log(index_1.StalkEvents.ON_USER_LOGIN);
                self.serverListener.onUserLogin(data);
            });
            self.socket.on(index_1.StalkEvents.ON_USER_LOGOUT, data => {
                console.log(index_1.StalkEvents.ON_USER_LOGOUT);
                self.serverListener.onUserLogout(data);
            });
        }
        addChatListener(obj) {
            this.chatServerListener = obj;
            let self = this;
            self.socket.on(index_1.ChatEvents.ON_CHAT, function (data) {
                console.log(index_1.ChatEvents.ON_CHAT, JSON.stringify(data));
                self.chatServerListener.onChat(data);
            });
            self.socket.on(index_1.ChatEvents.ON_ADD, (data) => {
                console.log(index_1.ChatEvents.ON_ADD, data);
                self.chatServerListener.onRoomJoin(data);
            });
            self.socket.on(index_1.ChatEvents.ON_LEAVE, (data) => {
                console.log(index_1.ChatEvents.ON_LEAVE, data);
                self.chatServerListener.onLeaveRoom(data);
            });
        }
    }
    StalkCodeExam.ServerListener = ServerListener;
})(StalkCodeExam = exports.StalkCodeExam || (exports.StalkCodeExam = {}));
class YourApp {
    constructor() {
        this.exam = new StalkCodeExam.Factory("stalk.com", 3010);
        this.chatApi = new index_1.API.ChatRoomAPI(this.exam.stalk);
        this.pushApi = new index_1.API.PushAPI(this.exam.stalk);
    }
    /**
     *
     * login to stalk.
     */
    stalkLogin(user) {
        this.exam.stalkInit().then(socket => {
            this.exam.handshake(user._id).then((connector) => {
                this.exam.checkIn(user).then((value) => {
                    console.log("Joined stalk-service success", value);
                    let result = JSON.parse(JSON.stringify(value.data));
                    if (result.success) {
                        // Save token for your session..
                        // Listen for message...
                        this.listeners = new StalkCodeExam.ServerListener(this.exam.stalk.getSocket());
                    }
                    else {
                        console.warn("Joined chat-server fail: ", result);
                    }
                }).catch(err => {
                    console.warn("Cannot checkIn", err);
                });
            }).catch(err => {
                console.warn("Hanshake fail: ", err);
            });
        }).catch(err => {
            console.log("StalkInit Fail.", err);
        });
    }
    /**
     * logout and disconnections.
     */
    stalkLogout() {
        this.exam.checkOut();
    }
    chat(message) {
        this.chatApi.chat("*", message, (err, res) => {
        });
    }
    push(message) {
        // let msg: IDictionary = {};
        // msg["event"] = "Test api.";
        // msg["message"] = "test api from express.js client.";
        // msg["timestamp"] = new Date();
        // msg["members"] = "*";
        this.pushApi.push(message).then(result => {
        }).catch(err => {
        });
    }
}
exports.YourApp = YourApp;
