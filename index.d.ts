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
export declare type ServerImplemented = Stalk.ServerImplemented;
export declare type LobbyAPI = API.LobbyAPI;
export declare type GateAPI = API.GateAPI;
export declare type PushAPI = API.PushAPI;
export declare type ChatRoomAPI = API.ChatRoomAPI;
export declare type CallAPI = API.CallingAPI;
export declare module StalkFactory {
    module Utils {
        var statusCode: typeof HttpStatusCode;
        var tokenDecode: typeof Authen.TokenDecoded;
    }
    function create(_host: string, _port: number): Stalk.ServerImplemented;
    function init(server: ServerImplemented): Promise<IPomelo>;
    function geteEnter(server: ServerImplemented, message: IDictionary): Promise<IServer>;
    function handshake(server: ServerImplemented, params: Stalk.ServerParam): Promise<IPomelo>;
    function checkIn(server: ServerImplemented, message: IDictionary): Promise<{}>;
    function checkOut(server: ServerImplemented): void;
}
declare module "stalk-js" {
    export = StalkFactory;
}
