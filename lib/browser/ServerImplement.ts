/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 * 
 * Ahoo Studio.co.th 
 */

import { HttpStatusCode } from "../utils/httpStatusCode";
import { API } from "./API";
import { IPomeloResponse, IPomelo, ServerParam } from "../utils/PomeloUtils";
const Pomelo = require("../pomelo/reactWSClient");

export namespace Stalk {
    /**
     * @deprecated Use es6 Map instead.
     */
    export interface IDictionary { [k: string]: string | any; }

    export class ServerImplemented {
        private static Instance: ServerImplemented;
        public static getInstance(): ServerImplemented {
            return this.Instance;
        }
        public static createInstance(host: string, port: number) {
            if (this.Instance === null || this.Instance === undefined) {
                this.Instance = new ServerImplemented(host, port);

                return this.Instance;
            }
            else {
                return this.Instance;
            }
        }

        private socket: IPomelo;
        public getSocket() {
            if (this.socket !== null) {
                return this.socket;
            }
            else {
                throw new Error("No socket instance!");
            }
        }
        private gateAPI: API.GateAPI;
        private lobby: API.LobbyAPI;
        private chatroomAPI: API.ChatRoomAPI;
        private callingAPI: API.CallingAPI;
        private pushApi: API.PushAPI;
        public getGateAPI() { return this.gateAPI; }
        public getLobby() { return this.lobby; }
        public getChatRoomAPI() { return this.chatroomAPI; }
        public getCallingAPI() { return this.callingAPI; }
        public getPushApi() { return this.pushApi; }

        host: string;
        port: number | string;
        _isConnected = false;
        _isLogedin = false;
        connect = this.connectServer;
        onSocketOpen: (data: any) => void;
        onSocketClose: (data: any) => void;
        onSocketReconnect: (data: any) => void;
        onDisconnected: (data: any) => void;

        constructor(host: string, port: number) {
            console.log("ServerImp", host, port);

            this.host = host;
            this.port = port;
            this.gateAPI = new API.GateAPI(this);
            this.lobby = new API.LobbyAPI(this);
            this.chatroomAPI = new API.ChatRoomAPI(this);
            this.callingAPI = new API.CallingAPI(this);
            this.pushApi = new API.PushAPI(this);

            this.connectServer = this.connectServer.bind(this);
            this.listenSocketEvents = this.listenSocketEvents.bind(this);
        }

        public dispose() {
            console.warn("dispose socket client.");

            this.disConnect();

            delete ServerImplemented.Instance;
        }

        public disConnect(callBack?: Function) {
            let self = this;
            if (!!self.socket) {
                self.socket.removeAllListeners();
                self.socket.disconnect().then(() => {
                    if (callBack) {
                        callBack();
                    }
                });
            }
            else {
                if (callBack) {
                    callBack();
                }
            }
        }

        public init(callback: (err: Error, res: IPomelo) => void) {
            let self = this;
            this._isConnected = false;
            this.socket = Pomelo;

            console.log("stalkInit...");

            if (!!self.socket) {
                // <!-- Connecting gate server.
                let params = { host: self.host, port: self.port, reconnect: false } as ServerParam;
                self.connectServer(params, (err) => {
                    callback(err, self.socket);
                });
            }
            else {
                console.warn("pomelo socket is un ready.");
            }
        }

        private connectServer(params: ServerParam, callback: (err: Error) => void) {
            let self = this;
            this.socket.init(params, function cb(err: any) {
                console.log("socket init... ", err);
                self.socket.setInitCallback();
                callback(err);
            });
        }

        public listenSocketEvents() {
            this.socket.removeAllListeners();

            this.socket.on("onopen", (this.onSocketOpen) ?
                this.onSocketOpen : (data: any) => console.log("onopen", data));
            this.socket.on("close", (!!this.onSocketClose) ?
                this.onSocketClose : (data: any) => {
                    console.warn("close", data);
                    this.socket.setInitCallback();
                });
            this.socket.on("reconnect", (this.onSocketReconnect) ?
                this.onSocketReconnect : (data: any) => console.log("reconnect", data));
            this.socket.on("disconnected", (data: any) => {
                console.warn("disconnected", data);
                this._isConnected = false;
                this.socket.setInitCallback();
                if (this.onDisconnected) {
                    this.onDisconnected(data);
                }
            });
            this.socket.on("io-error", (data: any) => {
                console.warn("io-error", data);
                this.socket.setInitCallback();
            });
        }
    }
}
