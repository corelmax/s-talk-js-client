"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var httpStatusCode_1 = require("../utils/httpStatusCode");
var API;
(function (API) {
    var LobbyAPI = (function () {
        function LobbyAPI(_server) {
            this.server = _server;
        }
        LobbyAPI.prototype.checkIn = function (msg) {
            var self = this;
            var socket = this.server.getSocket();
            return new Promise(function (resolve, rejected) {
                // <!-- Authentication.
                socket.request("connector.entryHandler.login", msg, function (res) {
                    if (res.code === httpStatusCode_1.HttpStatusCode.fail) {
                        rejected(res.message);
                    }
                    else if (res.code === httpStatusCode_1.HttpStatusCode.success) {
                        resolve(res);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        };
        LobbyAPI.prototype.logout = function () {
            var registrationId = "";
            var msg = {};
            msg["username"] = null;
            msg["registrationId"] = registrationId;
            var socket = this.server.getSocket();
            if (socket != null) {
                socket.notify("connector.entryHandler.logout", msg);
            }
            this.server.disConnect();
            this.server = null;
        };
        // <!-- Join and leave chat room.
        LobbyAPI.prototype.joinRoom = function (token, username, room_id, callback) {
            var self = this;
            var msg = {};
            msg["token"] = token;
            msg["rid"] = room_id;
            msg["username"] = username;
            var socket = this.server.getSocket();
            socket.request("connector.entryHandler.enterRoom", msg, function (result) {
                if (callback !== null) {
                    callback(null, result);
                }
            });
        };
        LobbyAPI.prototype.leaveRoom = function (token, roomId, callback) {
            var self = this;
            var msg = {};
            msg["token"] = token;
            msg["rid"] = roomId;
            var socket = this.server.getSocket();
            socket.request("connector.entryHandler.leaveRoom", msg, function (result) {
                if (callback != null)
                    callback(null, result);
            });
        };
        return LobbyAPI;
    }());
    API.LobbyAPI = LobbyAPI;
    var ChatRoomAPI = (function () {
        function ChatRoomAPI(_server) {
            this.server = _server;
        }
        ChatRoomAPI.prototype.chat = function (target, _message, callback) {
            var socket = this.server.getSocket();
            socket.request("chat.chatHandler.send", _message, function (result) {
                if (callback !== null) {
                    if (result instanceof Error)
                        callback(result, null);
                    else
                        callback(null, result);
                }
            });
        };
        ChatRoomAPI.prototype.pushByUids = function (_message) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, rejected) {
                            try {
                                var socket = _this.server.getSocket();
                                socket.request("chat.chatHandler.pushByUids", _message, function (result) {
                                    resolve(result);
                                });
                            }
                            catch (ex) {
                                rejected(ex);
                            }
                        })];
                });
            });
        };
        ChatRoomAPI.prototype.getSyncDateTime = function (callback) {
            var socket = this.server.getSocket();
            var message = {};
            socket.request("chat.chatHandler.getSyncDateTime", message, function (result) {
                if (callback != null) {
                    callback(null, result);
                }
            });
        };
        /**
         * get older message histories.
         */
        ChatRoomAPI.prototype.getOlderMessageChunk = function (roomId, topEdgeMessageTime, callback) {
            var socket = this.server.getSocket();
            var message = {};
            message["rid"] = roomId;
            message["topEdgeMessageTime"] = topEdgeMessageTime.toString();
            socket.request("chat.chatHandler.getOlderMessageChunk", message, function (result) {
                console.log("getOlderMessageChunk", result);
                if (callback !== null)
                    callback(null, result);
            });
        };
        ChatRoomAPI.prototype.getMessagesReaders = function (topEdgeMessageTime) {
            var socket = this.server.getSocket();
            var message = {};
            message["topEdgeMessageTime"] = topEdgeMessageTime;
            socket.request("chat.chatHandler.getMessagesReaders", message, function (result) {
                console.info("getMessagesReaders respones: ", result);
            });
        };
        ChatRoomAPI.prototype.getMessageContent = function (messageId, callback) {
            var socket = this.server.getSocket();
            var message = {};
            message["messageId"] = messageId;
            socket.request("chat.chatHandler.getMessageContent", message, function (result) {
                if (!!callback) {
                    callback(null, result);
                }
            });
        };
        ChatRoomAPI.prototype.updateMessageReader = function (messageId, roomId) {
            var socket = this.server.getSocket();
            var message = {};
            message["messageId"] = messageId;
            message["roomId"] = roomId;
            socket.notify("chat.chatHandler.updateWhoReadMessage", message);
        };
        ChatRoomAPI.prototype.updateMessageReaders = function (messageIds, roomId) {
            var socket = this.server.getSocket();
            var message = {};
            message["messageIds"] = JSON.stringify(messageIds);
            message["roomId"] = roomId;
            socket.notify("chat.chatHandler.updateWhoReadMessages", message);
        };
        return ChatRoomAPI;
    }());
    API.ChatRoomAPI = ChatRoomAPI;
    var PushAPI = (function () {
        function PushAPI(_server) {
            this.server = _server;
        }
        PushAPI.prototype.push = function (_message) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                try {
                                    var socket = _this.server.getSocket();
                                    socket.request("push.pushHandler.push", _message, function (result) {
                                        console.log("push result", result);
                                        resolve(result);
                                    });
                                }
                                catch (ex) {
                                    reject(ex.message);
                                }
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return PushAPI;
    }());
    API.PushAPI = PushAPI;
    /**
     * calling experiences between phones, apps and VoIP systems
     */
    var CallingAPI = (function () {
        function CallingAPI(_server) {
            this.server = _server;
        }
        CallingAPI.prototype.videoCallRequest = function (target_ids, user_id, room_id, api_key) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var _message;
                return __generator(this, function (_a) {
                    _message = {};
                    _message["target_ids"] = target_ids;
                    _message["user_id"] = user_id;
                    _message["room_id"] = room_id;
                    _message["x-api-key"] = api_key;
                    return [2 /*return*/, new Promise(function (resolve, rejected) {
                            try {
                                var socket = _this.server.getSocket();
                                socket.request("connector.entryHandler.videoCallRequest", _message, function (result) {
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
                        })];
                });
            });
        };
        CallingAPI.prototype.voiceCallRequest = function (target_ids, user_id, api_key) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var msg;
                return __generator(this, function (_a) {
                    msg = {};
                    msg["target_ids"] = target_ids;
                    msg["user_id"] = user_id;
                    msg["x-api-key"] = api_key;
                    return [2 /*return*/, new Promise(function (resolve, rejected) {
                            try {
                                var socket = _this.server.getSocket();
                                socket.request("connector.entryHandler.voiceCallRequest", msg, function (result) {
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
                        })];
                });
            });
        };
        CallingAPI.prototype.hangupCall = function (myId, contactId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var msg;
                return __generator(this, function (_a) {
                    msg = {};
                    msg["userId"] = myId;
                    msg["contactId"] = contactId;
                    return [2 /*return*/, new Promise(function (resolve, rejected) {
                            try {
                                var socket = _this.server.getSocket();
                                socket.request("connector.entryHandler.hangupCall", msg, function (result) {
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
                        })];
                });
            });
        };
        CallingAPI.prototype.theLineIsBusy = function (contactId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var msg;
                return __generator(this, function (_a) {
                    msg = {};
                    msg["contactId"] = contactId;
                    return [2 /*return*/, new Promise(function (resolve, rejected) {
                            try {
                                var socket = _this.server.getSocket();
                                socket.request("connector.entryHandler.theLineIsBusy", msg, function (result) {
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
                        })];
                });
            });
        };
        return CallingAPI;
    }());
    API.CallingAPI = CallingAPI;
})(API = exports.API || (exports.API = {}));
