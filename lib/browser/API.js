"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
var API;
(function (API) {
    class LobbyAPI {
        constructor(_server) {
            this.server = _server;
        }
        checkIn(msg) {
            let self = this;
            let socket = this.server.getSocket();
            return new Promise((resolve, rejected) => {
                // <!-- Authentication.
                socket.request("connector.entryHandler.login", msg, function (res) {
                    if (res.code === index_1.HttpStatusCode.fail) {
                        rejected(res.message);
                    }
                    else if (res.code === index_1.HttpStatusCode.success) {
                        resolve(res);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        }
        logout() {
            let registrationId = "";
            let msg = {};
            msg["username"] = null;
            msg["registrationId"] = registrationId;
            let socket = this.server.getSocket();
            if (socket != null) {
                socket.notify("connector.entryHandler.logout", msg);
            }
            this.server.disConnect();
            this.server = null;
        }
        /**
         * user : {_id: string, username: string, payload }
         * @param msg
         */
        updateUser(msg) {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this;
                let socket = this.server.getSocket();
                return new Promise((resolve, rejected) => {
                    // <!-- Authentication.
                    socket.request("connector.entryHandler.updateUser", msg, function (res) {
                        if (res.code === index_1.HttpStatusCode.fail) {
                            rejected(res.message);
                        }
                        else if (res.code === index_1.HttpStatusCode.success) {
                            resolve(res);
                        }
                        else {
                            resolve(res);
                        }
                    });
                });
            });
        }
        // <!-- Join and leave chat room.
        joinRoom(token, username, room_id, callback) {
            let self = this;
            let msg = {};
            msg["token"] = token;
            msg["rid"] = room_id;
            msg["username"] = username;
            let socket = this.server.getSocket();
            socket.request("connector.entryHandler.enterRoom", msg, (result) => {
                if (callback !== null) {
                    callback(null, result);
                }
            });
        }
        leaveRoom(token, roomId, callback) {
            let self = this;
            let msg = {};
            msg["token"] = token;
            msg["rid"] = roomId;
            let socket = this.server.getSocket();
            socket.request("connector.entryHandler.leaveRoom", msg, (result) => {
                if (callback != null) {
                    callback(null, result);
                }
            });
        }
    }
    API.LobbyAPI = LobbyAPI;
    class ChatRoomAPI {
        constructor(_server) {
            this.server = _server;
        }
        chat(target, _message, callback) {
            let socket = this.server.getSocket();
            socket.request("chat.chatHandler.send", _message, (result) => {
                if (callback !== null) {
                    if (result instanceof Error) {
                        callback(result, null);
                    }
                    else {
                        callback(null, result);
                    }
                }
            });
        }
        pushByUids(_message) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, rejected) => {
                    try {
                        let socket = this.server.getSocket();
                        socket.request("chat.chatHandler.pushByUids", _message, (result) => {
                            resolve(result);
                        });
                    }
                    catch (ex) {
                        rejected(ex);
                    }
                });
            });
        }
        getSyncDateTime(callback) {
            let socket = this.server.getSocket();
            let message = {};
            socket.request("chat.chatHandler.getSyncDateTime", message, (result) => {
                if (callback != null) {
                    callback(null, result);
                }
            });
        }
        /**
         * get older message histories.
         */
        getOlderMessageChunk(roomId, topEdgeMessageTime, callback) {
            let socket = this.server.getSocket();
            let message = {};
            message["rid"] = roomId;
            message["topEdgeMessageTime"] = topEdgeMessageTime.toString();
            socket.request("chat.chatHandler.getOlderMessageChunk", message, (result) => {
                console.log("getOlderMessageChunk", result);
                if (callback !== null) {
                    callback(null, result);
                }
            });
        }
        getMessagesReaders(topEdgeMessageTime) {
            let socket = this.server.getSocket();
            let message = {};
            message["topEdgeMessageTime"] = topEdgeMessageTime;
            socket.request("chat.chatHandler.getMessagesReaders", message, (result) => {
                console.info("getMessagesReaders respones: ", result);
            });
        }
        getMessageContent(messageId, callback) {
            let socket = this.server.getSocket();
            let message = {};
            message["messageId"] = messageId;
            socket.request("chat.chatHandler.getMessageContent", message, (result) => {
                if (!!callback) {
                    callback(null, result);
                }
            });
        }
        updateMessageReader(messageId, roomId) {
            let socket = this.server.getSocket();
            let message = {};
            message["messageId"] = messageId;
            message["roomId"] = roomId;
            socket.notify("chat.chatHandler.updateWhoReadMessage", message);
        }
        updateMessageReaders(messageIds, roomId) {
            let socket = this.server.getSocket();
            let message = {};
            message["messageIds"] = JSON.stringify(messageIds);
            message["roomId"] = roomId;
            socket.notify("chat.chatHandler.updateWhoReadMessages", message);
        }
    }
    API.ChatRoomAPI = ChatRoomAPI;
    class PushAPI {
        constructor(_server) {
            this.server = _server;
        }
        /**
         * payload: {
         *  event: string;
         * message: string;
         * members: string[] | string;}
         *
         * @param {IDictionary} _message
         * @returns
         * @memberof PushAPI
         */
        push(_message) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield new Promise((resolve, reject) => {
                    try {
                        let socket = this.server.getSocket();
                        socket.request("push.pushHandler.push", _message, (result) => {
                            resolve(result);
                        });
                    }
                    catch (ex) {
                        reject(ex.message);
                    }
                });
            });
        }
    }
    API.PushAPI = PushAPI;
    /**
     * calling experiences between phones, apps and VoIP systems
     */
    class CallingAPI {
        constructor(_server) {
            this.server = _server;
        }
        calling(api_key, event, members, payload) {
            return __awaiter(this, void 0, void 0, function* () {
                let _message = {};
                _message["members"] = members;
                _message["event"] = event;
                _message["x-api-key"] = api_key;
                _message["payload"] = payload;
                return new Promise((resolve, rejected) => {
                    try {
                        let socket = this.server.getSocket();
                        socket.request("connector.entryHandler.calling", _message, (result) => {
                            if (result.code == 200) {
                                resolve(result);
                            }
                            else {
                                rejected(result.message);
                            }
                        });
                    }
                    catch (ex) {
                        rejected(ex);
                    }
                });
            });
        }
        theLineIsBusy(contactId) {
            return __awaiter(this, void 0, void 0, function* () {
                let msg = {};
                msg["contactId"] = contactId;
                return new Promise((resolve, rejected) => {
                    try {
                        let socket = this.server.getSocket();
                        socket.request("connector.entryHandler.theLineIsBusy", msg, (result) => {
                            if (result.code == 200) {
                                resolve(result);
                            }
                            else {
                                rejected(result.message);
                            }
                        });
                    }
                    catch (ex) {
                        rejected(ex);
                    }
                });
            });
        }
    }
    API.CallingAPI = CallingAPI;
})(API = exports.API || (exports.API = {}));
