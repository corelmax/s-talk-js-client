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
var index_1 = require("../../index");
var StalkCodeExam;
(function (StalkCodeExam) {
    /**
     * Preparing connection...
     */
    var Factory = (function () {
        function Factory(host, port) {
            this.stalk = index_1.StalkFactory.create(host, port);
        }
        Factory.prototype.stalkInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var socket;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, index_1.StalkFactory.init(this.stalk)];
                        case 1:
                            socket = _a.sent();
                            return [2 /*return*/, socket];
                    }
                });
            });
        };
        Factory.prototype.handshake = function (uid) {
            return __awaiter(this, void 0, void 0, function () {
                var msg, connector, params, ex_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            msg = {};
                            msg["uid"] = uid;
                            msg["x-api-key"] =  /* your api key*/;
                            return [4 /*yield*/, index_1.StalkFactory.geteEnter(this.stalk, msg)];
                        case 1:
                            connector = _a.sent();
                            params = { host: connector.host, port: connector.port, reconnect: false };
                            return [4 /*yield*/, index_1.StalkFactory.handshake(this.stalk, params)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, connector];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4:
                            ex_1 = _a.sent();
                            throw new Error("handshake fail: " + ex_1.message);
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        Factory.prototype.checkIn = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var msg, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            msg = {};
                            msg["user"] = user;
                            msg["x-api-key"] =  /* your api key*/;
                            return [4 /*yield*/, index_1.StalkFactory.checkIn(this.stalk, msg)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        Factory.prototype.checkOut = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, index_1.StalkFactory.checkOut(this.stalk)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return Factory;
    }());
    StalkCodeExam.Factory = Factory;
    /**
     * Listenning for messages...
     */
    var ServerListener = (function () {
        function ServerListener(socket) {
            this.socket = socket;
        }
        ServerListener.prototype.addPushListener = function (obj) {
            this.pushServerListener = obj;
            var self = this;
            self.socket.on(index_1.PushEvents.ON_PUSH, function (data) {
                console.log(index_1.PushEvents.ON_PUSH, JSON.stringify(data));
                self.pushServerListener.onPush(data);
            });
        };
        ServerListener.prototype.addServerListener = function (obj) {
            this.serverListener = obj;
            var self = this;
            // <!-- User -->
            self.socket.on(index_1.StalkEvents.ON_USER_LOGIN, function (data) {
                console.log(index_1.StalkEvents.ON_USER_LOGIN);
                self.serverListener.onUserLogin(data);
            });
            self.socket.on(index_1.StalkEvents.ON_USER_LOGOUT, function (data) {
                console.log(index_1.StalkEvents.ON_USER_LOGOUT);
                self.serverListener.onUserLogout(data);
            });
        };
        ServerListener.prototype.addChatListener = function (obj) {
            this.chatServerListener = obj;
            var self = this;
            self.socket.on(index_1.ChatEvents.ON_CHAT, function (data) {
                console.log(index_1.ChatEvents.ON_CHAT, JSON.stringify(data));
                self.chatServerListener.onChat(data);
            });
            self.socket.on(index_1.ChatEvents.ON_ADD, function (data) {
                console.log(index_1.ChatEvents.ON_ADD, data);
                self.chatServerListener.onRoomJoin(data);
            });
            self.socket.on(index_1.ChatEvents.ON_LEAVE, function (data) {
                console.log(index_1.ChatEvents.ON_LEAVE, data);
                self.chatServerListener.onLeaveRoom(data);
            });
            self.socket.on(index_1.ChatEvents.ON_MESSAGE_READ, function (data) {
                console.log(index_1.ChatEvents.ON_MESSAGE_READ);
                self.chatServerListener.onMessageRead(data);
            });
            self.socket.on(index_1.ChatEvents.ON_GET_MESSAGES_READERS, function (data) {
                console.log(index_1.ChatEvents.ON_GET_MESSAGES_READERS);
                self.chatServerListener.onGetMessagesReaders(data);
            });
        };
        return ServerListener;
    }());
    StalkCodeExam.ServerListener = ServerListener;
})(StalkCodeExam = exports.StalkCodeExam || (exports.StalkCodeExam = {}));
var YourApp = (function () {
    function YourApp() {
        this.exam = new StalkCodeExam.Factory("stalk.com", 3010);
        this.chatApi = new index_1.API.ChatRoomAPI(this.exam.stalk);
        this.pushApi = new index_1.API.PushAPI(this.exam.stalk);
    }
    /**
     *
     * login to stalk.
     */
    YourApp.prototype.stalkLogin = function (user) {
        var _this = this;
        this.exam.stalkInit().then(function (socket) {
            _this.exam.handshake(user._id).then(function (connector) {
                _this.exam.checkIn(user).then(function (value) {
                    console.log("Joined stalk-service success", value);
                    var result = JSON.parse(JSON.stringify(value.data));
                    if (result.success) {
                        // Save token for your session..
                        // Listen for message...
                        _this.listeners = new StalkCodeExam.ServerListener(_this.exam.stalk.getSocket());
                    }
                    else {
                        console.warn("Joined chat-server fail: ", result);
                    }
                }).catch(function (err) {
                    console.warn("Cannot checkIn", err);
                });
            }).catch(function (err) {
                console.warn("Hanshake fail: ", err);
            });
        }).catch(function (err) {
            console.log("StalkInit Fail.", err);
        });
    };
    /**
     * logout and disconnections.
     */
    YourApp.prototype.stalkLogout = function () {
        this.exam.checkOut();
    };
    YourApp.prototype.chat = function (message) {
        this.chatApi.chat("*", message, function (err, res) {
        });
    };
    YourApp.prototype.push = function (message) {
        // let msg: IDictionary = {};
        // msg["event"] = "Test api.";
        // msg["message"] = "test api from express.js client.";
        // msg["timestamp"] = new Date();
        // msg["members"] = "*";
        this.pushApi.push(message).then(function (result) {
        }).catch(function (err) {
        });
    };
    return YourApp;
}());
exports.YourApp = YourApp;
