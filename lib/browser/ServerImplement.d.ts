import { API } from "./API";
import { IPomelo, ServerParam } from "../utils/PomeloUtils";
export declare namespace Stalk {
    /**
     * @deprecated Use es6 Map instead.
     */
    interface IDictionary {
        [k: string]: string | any;
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
