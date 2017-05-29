/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
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
var stalk_js_1 = require("stalk-js");
var ChatRoomApiProvider = stalk_js_1.ChatRoomApi.ChatRoomApiProvider;
var ServerImplemented = stalk_js_1.Stalk.ServerImplemented;
/**
 * Preparing connection...
 */
var Example = (function () {
    function Example(host, port) {
        this.stalk = stalk_js_1.StalkFactory.create(host, port);
    }
    Example.prototype.stalkInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var socket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, stalk_js_1.StalkFactory.init(this.stalk)];
                    case 1:
                        socket = _a.sent();
                        return [2 /*return*/, socket];
                }
            });
        });
    };
    Example.prototype.handshake = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, connector, params, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        msg = {};
                        msg["uid"] = uid;
                        msg["x-api-key"] =  /* your api key*/;
                        return [4 /*yield*/, stalk_js_1.StalkFactory.geteEnter(this.stalk, msg)];
                    case 1:
                        connector = _a.sent();
                        params = { host: connector.host, port: connector.port, reconnect: false };
                        return [4 /*yield*/, stalk_js_1.StalkFactory.handshake(this.stalk, params)];
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
    Example.prototype.checkIn = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msg = {};
                        msg["user"] = user;
                        msg["x-api-key"] =  /* your api key*/;
                        return [4 /*yield*/, stalk_js_1.StalkFactory.checkIn(this.stalk, msg)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Example;
}());
exports.Example = Example;
/**
 *
 * login to stalk.
 */
function stalkLogin(user) {
    var exam = new Example("stalk.com", 3010);
    exam.stalkInit().then(function (socket) {
        exam.handshake(user._id).then(function (connector) {
            exam.checkIn(user).then(function (value) {
                console.log("Joined stalk-service success", value);
                var result = JSON.parse(JSON.stringify(value.data));
                if (result.success) {
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
}
exports.stalkLogin = stalkLogin;
