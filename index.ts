/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th 
 */

export { Stalk, IPomelo, IServer, IDictionary } from "./lib/browser/serverImplemented";
export * from "./lib/browser/StalkEvents";
export * from "./lib/browser/API";

import { HttpStatusCode } from "./lib/utils/httpStatusCode";
import { Authen } from "./lib/utils/tokenDecode";
import { Stalk, IPomelo, IServer, IDictionary } from "./lib/browser/serverImplemented";
import { API } from "./lib/browser/API";

export module StalkFactory {
    // export type ServerImplemented = Stalk.ServerImplemented;
    // export type LobbyAPI = API.LobbyAPI;
    // export type GateAPI = API.GateAPI;
    // export type PushAPI = API.PushAPI;
    // export type ChatRoomAPI = API.ChatRoomAPI;
    // export type CallAPI = API.CallingAPI;

    export module Utils {
        export var statusCode = HttpStatusCode;
        export var tokenDecode = Authen.TokenDecoded;
    }

    export function create(_host: string, _port: number) {
        // "ws://stalk.com"
        let server = Stalk.ServerImplemented.createInstance(_host, _port);
        return server;
    }

    export async function init(server: Stalk.ServerImplemented) {
        let promise = new Promise<IPomelo>((resolve, reject) => {
            server.disConnect(() => {
                server.init((err: Error, res: IPomelo) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        });

        return await promise;
    }

    export async function geteEnter(server: Stalk.ServerImplemented, message: IDictionary) {
        let connector = await server.getGateAPI().gateEnter(message);
        return connector;
    }

    export async function handshake(server: Stalk.ServerImplemented, params: Stalk.ServerParam) {
        return await new Promise<IPomelo>((resolve, reject) => {
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
    }

    export async function checkIn(server: Stalk.ServerImplemented, message: IDictionary) {
        let result = await server.getLobby().checkIn(message);
        return result;
    }

    export function checkOut(server: Stalk.ServerImplemented) {
        if (server) {
            let socket = server.getSocket();
            if (!!socket) { socket.setReconnect(false); }

            server.getLobby().logout();
            server.dispose();
        }
    }
}
// declare module "stalk-js" {
//     export = StalkFactory;
// }