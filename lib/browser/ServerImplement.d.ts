/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
import * as API from "./api/index";
import { IPomelo, ServerParam } from "../utils/PomeloUtils";
/**
* @deprecated Use es6 Map instead.
*/
export interface IDictionary {
    [k: string]: string | any;
}
export declare class ServerImp {
    private static Instance;
    static getInstance(): ServerImp;
    static createInstance(host: string, port: number): ServerImp;
    private socket;
    getSocket(): IPomelo;
    private gateAPI;
    private lobby;
    private chatroomAPI;
    private callingAPI;
    private pushApi;
    getGateAPI(): API.GateAPI;
    getLobby(): API.LobbyAPI;
    getChatRoomAPI(): API.ChatRoomAPI;
    getCallingAPI(): API.CallingAPI;
    getPushApi(): API.PushAPI;
    host: string;
    port: number | string;
    _isConnected: boolean;
    _isLogedin: boolean;
    connect: (params: ServerParam, callback: (err: Error) => void) => void;
    onSocketOpen: (data: any) => void;
    onSocketClose: (data: any) => void;
    onSocketReconnect: (data: any) => void;
    onDisconnected: (data: any) => void;
    constructor(host: string, port: number);
    dispose(): void;
    disConnect(callBack?: Function): void;
    init(callback: (err: Error, res: IPomelo) => void): void;
    private connectServer;
    listenSocketEvents(): void;
}
