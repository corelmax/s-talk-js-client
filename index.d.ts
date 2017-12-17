/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
export { Stalk, IPomelo, IServer, IDictionary } from "./lib/browser/serverImplemented";
export * from "./lib/browser/StalkEvents";
export * from "./lib/browser/API";
import { HttpStatusCode } from "./lib/utils/httpStatusCode";
import { Authen } from "./lib/utils/tokenDecode";
import { Stalk, IPomelo, IServer, IDictionary } from "./lib/browser/serverImplemented";
import { API } from "./lib/browser/API";
export declare namespace Utils {
    var statusCode: typeof HttpStatusCode;
    var tokenDecode: typeof Authen.TokenDecoded;
}
export declare namespace StalkFactory {
    type ServerImplemented = Stalk.ServerImplemented;
    type LobbyAPI = API.LobbyAPI;
    type GateAPI = API.GateAPI;
    type PushAPI = API.PushAPI;
    type ChatRoomAPI = API.ChatRoomAPI;
    type CallAPI = API.CallingAPI;
    function create(_host: string, _port: number): Stalk.ServerImplemented | undefined;
    function init(server: ServerImplemented): Promise<IPomelo>;
    function geteEnter(server: ServerImplemented, message: IDictionary): Promise<IServer>;
    function handshake(server: ServerImplemented, params: Stalk.ServerParam): Promise<IPomelo>;
    function checkIn(server: ServerImplemented, message: IDictionary): Promise<{}>;
    function checkOut(server: ServerImplemented): void;
}
