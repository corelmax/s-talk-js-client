/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export { Stalk } from "./lib/browser/serverImplemented";
export * from "./lib/browser/StalkEvents";
export * from "./lib/browser/API";
import { HttpStatusCode } from "./lib/utils/httpStatusCode";
import { Authen } from "./lib/utils/tokenDecode";
import { Stalk } from "./lib/browser/serverImplemented";
export var Utils;
(function (Utils) {
    Utils.statusCode = HttpStatusCode;
    Utils.tokenDecode = Authen.TokenDecoded;
})(Utils || (Utils = {}));
export var StalkFactory;
(function (StalkFactory) {
    function create(_host, _port) {
        // "ws://stalk.com"
        let server = Stalk.ServerImplemented.createInstance(_host, _port);
        return server;
    }
    StalkFactory.create = create;
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
    StalkFactory.init = init;
    function geteEnter(server, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let connector = yield server.gateEnter(message);
            return connector;
        });
    }
    StalkFactory.geteEnter = geteEnter;
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
    StalkFactory.handshake = handshake;
    function checkIn(server, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield server.getLobby().checkIn(message);
            return result;
        });
    }
    StalkFactory.checkIn = checkIn;
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
    StalkFactory.checkOut = checkOut;
})(StalkFactory || (StalkFactory = {}));
