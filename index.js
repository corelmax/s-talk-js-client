"use strict";
/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var serverImplemented_1 = require("./lib/browser/serverImplemented");
exports.Stalk = serverImplemented_1.Stalk;
__export(require("./lib/browser/StalkEvents"));
__export(require("./lib/browser/API"));
const httpStatusCode_1 = require("./lib/utils/httpStatusCode");
const tokenDecode_1 = require("./lib/utils/tokenDecode");
const serverImplemented_2 = require("./lib/browser/serverImplemented");
var stalkjs;
(function (stalkjs) {
    // export type ServerImplemented = Stalk.ServerImplemented;
    // export type LobbyAPI = API.LobbyAPI;
    // export type GateAPI = API.GateAPI;
    // export type PushAPI = API.PushAPI;
    // export type ChatRoomAPI = API.ChatRoomAPI;
    // export type CallAPI = API.CallingAPI;
    let Utils;
    (function (Utils) {
        Utils.statusCode = httpStatusCode_1.HttpStatusCode;
        Utils.tokenDecode = tokenDecode_1.Authen.TokenDecoded;
    })(Utils = stalkjs.Utils || (stalkjs.Utils = {}));
    function create(_host, _port) {
        // "ws://stalk.com"
        let server = serverImplemented_2.Stalk.ServerImplemented.createInstance(_host, _port);
        return server;
    }
    stalkjs.create = create;
    function init(server) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                server.disConnect(() => {
                    server.init((err, res) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(res);
                        }
                    });
                });
            });
            return yield promise;
        });
    }
    stalkjs.init = init;
    function geteEnter(server, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let connector = yield server.getGateAPI().gateEnter(message);
            return connector;
        });
    }
    stalkjs.geteEnter = geteEnter;
    function handshake(server, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                server.connect(params, (err) => {
                    server._isConnected = true;
                    let socket = server.getSocket();
                    if (!!socket) {
                        server.listenSocketEvents();
                    }
                    if (!!err) {
                        reject(err);
                    }
                    else {
                        resolve(socket);
                    }
                });
            });
        });
    }
    stalkjs.handshake = handshake;
    function checkIn(server, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield server.getLobby().checkIn(message);
            return result;
        });
    }
    stalkjs.checkIn = checkIn;
    function checkOut(server) {
        if (server) {
            let socket = server.getSocket();
            if (!!socket) {
                socket.setReconnect(false);
            }
            server.getLobby().logout();
            server.dispose();
        }
    }
    stalkjs.checkOut = checkOut;
})(stalkjs = exports.stalkjs || (exports.stalkjs = {}));
