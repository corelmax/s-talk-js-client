/// <reference types="node" />
/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
import * as EventEmitter from "events";
import { API } from "./API";
export interface IPomeloResponse {
    code: number;
    message?: string;
    data?: any;
}
export interface IPomelo extends EventEmitter {
    init: (params: any, callback: (error?: any) => void) => void;
    notify: (route: string, message: any) => void;
    request: (route: string, message: any, callback: (result: IPomeloResponse) => void) => void;
    disconnect: () => Promise<null>;
    setReconnect: (reconnect: boolean) => void;
    setInitCallback: (error?: string) => void;
}
export interface IServer {
    host: string;
    port: number;
}
export interface IDictionary {
    [k: string]: string | any;
}
export declare namespace Stalk {
    class ServerParam implements IServer {
        host: string;
        port: number;
        reconnect: boolean;
    }
    class ServerImplemented {
        private static Instance;
        static getInstance(): ServerImplemented;
        static createInstance(host: string, port: number): ServerImplemented;
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
        private connectServer(params, callback);
        listenSocketEvents(): void;
    }
}
