/// <reference types="node" />
/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
import * as EventEmitter from "events";
import { API } from './API';
export interface IPomelo extends EventEmitter {
    init: any;
    notify: any;
    request: any;
    disconnect: any;
    setReconnect: any;
    setInitCallback: (error: string) => void;
}
export interface IServer {
    host: string;
    port: number;
}
export interface IDictionary {
    [k: string]: string | any;
}
export declare namespace Stalk {
    class ServerImplemented {
        private static Instance;
        static getInstance(): ServerImplemented;
        static createInstance(host: string, port: number): ServerImplemented;
        private socket;
        getSocket(): IPomelo;
        private lobby;
        getLobby(): API.LobbyAPI;
        private chatroomAPI;
        getChatRoomAPI(): API.ChatRoomAPI;
        private callingAPI;
        getCallingAPI(): API.CallingAPI;
        host: string;
        port: number | string;
        authenData: Stalk.IAuthenData;
        _isConnected: boolean;
        _isLogedin: boolean;
        connect: (params: ServerParam, callback: (err: any) => void) => void;
        onSocketOpen: (data) => void;
        onSocketClose: (data) => void;
        onSocketReconnect: (data) => void;
        onDisconnected: (data) => void;
        constructor(host: string, port: number);
        dispose(): void;
        disConnect(callBack?: Function): void;
        init(callback: (err, res: IPomelo) => void): void;
        private connectServer(params, callback);
        listenSocketEvents(): void;
        logIn(_username: string, _hash: string, deviceToken: string, callback: (err, res) => void): void;
        private authenForFrontendServer(_username, _hash, deviceToken, callback);
        gateEnter(msg: IDictionary): Promise<IServer>;
        TokenAuthen(tokenBearer: string, checkTokenCallback: (err, res) => void): void;
        private OnTokenAuthenticate(tokenRes, onSuccessCheckToken);
        kickMeAllSession(uid: string): void;
    }
    interface IAuthenData {
        userId: string;
        token: string;
    }
    class ServerParam implements IServer {
        host: string;
        port: number;
        reconnect: boolean;
    }
}
