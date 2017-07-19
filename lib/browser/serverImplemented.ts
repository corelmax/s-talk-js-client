/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 * 
 * Ahoo Studio.co.th 
 */
import * as EventEmitter from "events";

import { HttpStatusCode } from '../utils/httpStatusCode';
import { Authen } from '../utils/tokenDecode';
import { API } from './API';
const Pomelo = require("../pomelo/reactWSClient");

export interface IPomelo extends EventEmitter {
    init;
    notify;
    request;
    disconnect;
    setReconnect;
    setInitCallback: (error: string) => void;
};
export interface IServer { host: string; port: number; };
export interface IDictionary { [k: string]: string | any; }

export namespace Stalk {
    export class ServerImplemented {
        private static Instance: ServerImplemented;
        public static getInstance(): ServerImplemented {
            return this.Instance;
        }
        public static createInstance(host: string, port: number): ServerImplemented {
            if (this.Instance === null || this.Instance === undefined) {
                this.Instance = new ServerImplemented(host, port);

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
        private lobby: API.LobbyAPI;
        public getLobby() {
            return this.lobby;
        }
        private chatroomAPI: API.ChatRoomAPI;
        public getChatRoomAPI() {
            return this.chatroomAPI;
        }
        private callingAPI: API.CallingAPI;
        public getCallingAPI() {
            return this.callingAPI;
        }

        host: string;
        port: number | string;
        authenData: Stalk.IAuthenData;
        _isConnected = false;
        _isLogedin = false;
        connect = this.connectServer;
        onSocketOpen: (data) => void;
        onSocketClose: (data) => void;
        onSocketReconnect: (data) => void;
        onDisconnected: (data) => void;

        constructor(host: string, port: number) {
            console.log("ServerImp", host, port);

            this.host = host;
            this.port = port;
            this.lobby = new API.LobbyAPI(this);
            this.chatroomAPI = new API.ChatRoomAPI(this);
            this.callingAPI = new API.CallingAPI(this);

            this.connectServer = this.connectServer.bind(this);
            this.listenSocketEvents = this.listenSocketEvents.bind(this);
        }

        public dispose() {
            console.warn("dispose socket client.");

            this.disConnect();

            this.authenData = null;

            ServerImplemented.Instance = null;
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

        public init(callback: (err, res: IPomelo) => void) {
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

        private connectServer(params: ServerParam, callback: (err) => void) {
            let self = this;
            this.socket.init(params, function cb(err) {
                console.log("socket init... ", err);
                self.socket.setInitCallback(null);
                callback(err);
            });
        }

        public listenSocketEvents() {
            this.socket.removeAllListeners();

            this.socket.on("onopen", (this.onSocketOpen) ?
                this.onSocketOpen : (data) => console.log("onopen", data));
            this.socket.on("close", (!!this.onSocketClose) ?
                this.onSocketClose : (data) => {
                    console.warn("close", data);
                    this.socket.setInitCallback(null);
                });
            this.socket.on("reconnect", (this.onSocketReconnect) ?
                this.onSocketReconnect : (data) => console.log("reconnect", data));
            this.socket.on("disconnected", (data) => {
                console.warn("disconnected", data);
                this._isConnected = false;
                this.socket.setInitCallback(null);
                if (this.onDisconnected) {
                    this.onDisconnected(data);
                }
            });
            this.socket.on("io-error", (data) => {
                console.warn("io-error", data);
                this.socket.setInitCallback(null);
            });
        }

        // region <!-- Authentication...
        /// <summary>
        /// Connect to gate server then get query of connector server.
        /// </summary>
        public logIn(_username: string, _hash: string, deviceToken: string, callback: (err, res) => void) {
            let self = this;

            if (!!self.socket && this._isConnected === false) {
                let msg = { uid: _username };
                // <!-- Quering connector server.
                self.socket.request("gate.gateHandler.queryEntry", msg, function (result) {

                    console.log("QueryConnectorServ", JSON.stringify(result));

                    if (result.code === HttpStatusCode.success) {
                        self.disConnect();

                        let connectorPort = result.port;
                        // <!-- Connecting to connector server.
                        let params: ServerParam = { host: self.host, port: connectorPort, reconnect: true };
                        self.connectServer(params, (err) => {
                            self._isConnected = true;

                            if (!!err) {
                                callback(err, null);
                            }
                            else {
                                self.authenForFrontendServer(_username, _hash, deviceToken, callback);
                            }
                        });
                    }
                });
            }
            else if (!!self.socket && this._isConnected) {
                self.authenForFrontendServer(_username, _hash, deviceToken, callback);
            }
            else {
                console.warn("pomelo client is null: connecting status %s", this._isConnected);
                console.log("Automatic init pomelo socket...");

                self.init((err, res) => {
                    if (err) {
                        console.warn("Cannot starting pomelo socket!");

                        callback(err, null);
                    }
                    else {
                        console.log("Init socket success.");

                        self.logIn(_username, _hash, deviceToken, callback);
                    }
                });
            }
        }

        // <!-- Authentication. request for token sign.
        private authenForFrontendServer(_username: string, _hash: string, deviceToken: string, callback: (err, res) => void) {
            let self = this;

            let msg = {} as IDictionary;
            msg["email"] = _username;
            msg["password"] = _hash;
            msg["registrationId"] = deviceToken;
            // <!-- Authentication.
            self.socket.request("connector.entryHandler.login", msg, function (res) {
                console.log("login response: ", JSON.stringify(res));

                if (res.code === HttpStatusCode.fail) {
                    if (callback != null) {
                        callback(res.message, null);
                    }
                }
                else if (res.code === HttpStatusCode.success) {
                    if (callback != null) {
                        callback(null, res);
                    }
                }
                else {
                    if (callback !== null) {
                        callback(null, res);
                    }
                }
            });
        }

        gateEnter(msg: IDictionary) {
            let self = this;
            let result = new Promise((resolve: (data: IServer) => void, rejected) => {
                if (!!self.socket && this._isConnected === false) {
                    // <!-- Quering connector server.
                    self.socket.request("gate.gateHandler.queryEntry", msg, function (result) {
                        console.log("gateEnter", result);
                        if (result.code === HttpStatusCode.success) {
                            self.disConnect();

                            let data = { host: self.host, port: result.port };
                            resolve(data);
                        }
                        else {
                            rejected(result);
                        }
                    });
                }
                else {
                    let message = "pomelo client is null: connecting status is " + self._isConnected;
                    console.log("Automatic init pomelo socket...");

                    rejected(message);
                }
            });

            return result;
        }

        public TokenAuthen(tokenBearer: string, checkTokenCallback: (err, res) => void) {
            let self = this;
            let msg = {} as IDictionary;
            msg["token"] = tokenBearer;
            self.socket.request("gate.gateHandler.authenGateway", msg, (result) => {
                this.OnTokenAuthenticate(result, checkTokenCallback);
            });
        }

        private OnTokenAuthenticate(tokenRes: any, onSuccessCheckToken: (err, res) => void) {
            if (tokenRes.code === HttpStatusCode.success) {
                var data = tokenRes.data;
                var decode = data.decoded; //["decoded"];
                var decodedModel = JSON.parse(JSON.stringify(decode)) as Authen.TokenDecoded;
                if (onSuccessCheckToken != null) {
                    onSuccessCheckToken(null, { success: true, username: decodedModel.email, password: decodedModel.password });
                }
            }
            else {
                if (onSuccessCheckToken != null) {
                    onSuccessCheckToken(tokenRes, null);
                }
            }
        }

        public kickMeAllSession(uid: string) {
            let self = this;
            if (self.socket !== null) {
                var msg = { uid: uid };
                self.socket.request("connector.entryHandler.kickMe", msg, function (result) {
                    console.log("kickMe", JSON.stringify(result));
                });
            }
        }
    }
    export interface IAuthenData {
        userId: string;
        token: string;
    }
    export class ServerParam implements IServer {
        host: string;
        port: number;
        reconnect: boolean;
    }
}
