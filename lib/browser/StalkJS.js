var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Stalk } from "./ServerImplemented";
import { HttpStatusCode } from "../utils/httpStatusCode";
import { Authen } from "../utils/tokenDecode";
export var StalkJS;
(function (StalkJS) {
    // export type ServerImplemented = Stalk.ServerImplemented;
    // export type LobbyAPI = API.LobbyAPI;
    // export type GateAPI = API.GateAPI;
    // export type PushAPI = API.PushAPI;
    // export type ChatRoomAPI = API.ChatRoomAPI;
    // export type CallAPI = API.CallingAPI;
    let Utils;
    (function (Utils) {
        Utils.statusCode = HttpStatusCode;
        Utils.tokenDecode = Authen.TokenDecoded;
    })(Utils = StalkJS.Utils || (StalkJS.Utils = {}));
    function create(_host, _port) {
        // "ws://stalk.com"
        let server = Stalk.ServerImplemented.createInstance(_host, _port);
        return server;
    }
    StalkJS.create = create;
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
    StalkJS.init = init;
    function geteEnter(server, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let connector = yield server.getGateAPI().gateEnter(message);
            return connector;
        });
    }
    StalkJS.geteEnter = geteEnter;
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
    StalkJS.handshake = handshake;
    function checkIn(server, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield server.getLobby().checkIn(message);
            return result;
        });
    }
    StalkJS.checkIn = checkIn;
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
    StalkJS.checkOut = checkOut;
})(StalkJS || (StalkJS = {}));
