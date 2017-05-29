/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var serverImplemented_1 = require("./lib/browser/serverImplemented");
exports.Stalk = serverImplemented_1.Stalk;
var chatRoomApiProvider_1 = require("./lib/browser/chatRoomApiProvider");
exports.ChatRoomApi = chatRoomApiProvider_1.ChatRoomApi;
__export(require("./lib/browser/StalkEvents"));
var httpStatusCode_1 = require("./lib/utils/httpStatusCode");
var tokenDecode_1 = require("./lib/utils/tokenDecode");
var serverImplemented_2 = require("./lib/browser/serverImplemented");
var Utils;
(function (Utils) {
    Utils.statusCode = httpStatusCode_1.HttpStatusCode;
    Utils.tokenDecode = tokenDecode_1.Authen.TokenDecoded;
})(Utils = exports.Utils || (exports.Utils = {}));
var StalkFactory;
(function (StalkFactory) {
    function create(_host, _port) {
        var server = serverImplemented_2.Stalk.ServerImplemented.createInstance(_host, _port);
        return server;
    }
    StalkFactory.create = create;
    function init(server) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = new Promise(function (resolve, reject) {
                            server.disConnect(function () {
                                server.init(function (err, res) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(res);
                                    }
                                });
                            });
                        });
                        return [4 /*yield*/, promise];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    StalkFactory.init = init;
    function geteEnter(server, message) {
        return __awaiter(this, void 0, void 0, function () {
            var connector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server.gateEnter(message)];
                    case 1:
                        connector = _a.sent();
                        return [2 /*return*/, connector];
                }
            });
        });
    }
    StalkFactory.geteEnter = geteEnter;
    function handshake(server, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            server.connect(params, function (err) {
                                server._isConnected = true;
                                var socket = server.getSocket();
                                if (!!socket) {
                                    server.listenForPomeloEvents();
                                    socket.setReconnect(true);
                                }
                                if (!!err) {
                                    reject(err);
                                }
                                else {
                                    resolve();
                                }
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    StalkFactory.handshake = handshake;
    function checkIn(server, message) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server.checkIn(message)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    }
    StalkFactory.checkIn = checkIn;
    function checkOut(server) {
        if (server) {
            var socket = server.getSocket();
            if (!!socket) {
                socket.setReconnect(false);
            }
            server.logout();
            server.dispose();
        }
    }
    StalkFactory.checkOut = checkOut;
})(StalkFactory = exports.StalkFactory || (exports.StalkFactory = {}));
