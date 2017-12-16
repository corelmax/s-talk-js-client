"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = require("../utils/httpStatusCode");
const API_1 = require("./API");
const Pomelo = require("../pomelo/reactWSClient");
;
;
var Stalk;
(function (Stalk) {
    class ServerImplemented {
        constructor(host, port) {
            this._isConnected = false;
            this._isLogedin = false;
            this.connect = this.connectServer;
            console.log("ServerImp", host, port);
            this.host = host;
            this.port = port;
            this.lobby = new API_1.API.LobbyAPI(this);
            this.chatroomAPI = new API_1.API.ChatRoomAPI(this);
            this.callingAPI = new API_1.API.CallingAPI(this);
            this.pushApi = new API_1.API.PushAPI(this);
            this.connectServer = this.connectServer.bind(this);
            this.listenSocketEvents = this.listenSocketEvents.bind(this);
        }
        static getInstance() {
            return this.Instance;
        }
        static createInstance(host, port) {
            if (this.Instance === null || this.Instance === undefined) {
                this.Instance = new ServerImplemented(host, port);
                return this.Instance;
            }
        }
        getSocket() {
            if (this.socket !== null) {
                return this.socket;
            }
            else {
                throw new Error("No socket instance!");
            }
        }
        getLobby() {
            return this.lobby;
        }
        getChatRoomAPI() {
            return this.chatroomAPI;
        }
        getCallingAPI() {
            return this.callingAPI;
        }
        getPushApi() {
            return this.pushApi;
        }
        dispose() {
            console.warn("dispose socket client.");
            this.disConnect();
            this.authenData = undefined;
            ServerImplemented.Instance = undefined;
        }
        disConnect(callBack) {
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
        init(callback) {
            let self = this;
            this._isConnected = false;
            this.socket = Pomelo;
            console.log("stalkInit...");
            if (!!self.socket) {
                // <!-- Connecting gate server.
                let params = { host: self.host, port: self.port, reconnect: false };
                self.connectServer(params, (err) => {
                    callback(err, self.socket);
                });
            }
            else {
                console.warn("pomelo socket is un ready.");
            }
        }
        connectServer(params, callback) {
            let self = this;
            this.socket.init(params, function cb(err) {
                console.log("socket init... ", err);
                self.socket.setInitCallback(null);
                callback(err);
            });
        }
        listenSocketEvents() {
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
        logIn(_username, _hash, deviceToken, callback) {
            let self = this;
            if (!!self.socket && this._isConnected === false) {
                let msg = { uid: _username };
                // <!-- Quering connector server.
                self.socket.request("gate.gateHandler.queryEntry", msg, function (result) {
                    console.log("QueryConnectorServ", JSON.stringify(result));
                    if (result.code === httpStatusCode_1.HttpStatusCode.success) {
                        self.disConnect();
                        let connectorPort = result.port;
                        // <!-- Connecting to connector server.
                        let params = { host: self.host, port: connectorPort, reconnect: true };
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
        authenForFrontendServer(_username, _hash, deviceToken, callback) {
            let self = this;
            let msg = {};
            msg["email"] = _username;
            msg["password"] = _hash;
            msg["registrationId"] = deviceToken;
            // <!-- Authentication.
            self.socket.request("connector.entryHandler.login", msg, function (res) {
                console.log("login response: ", JSON.stringify(res));
                if (res.code === httpStatusCode_1.HttpStatusCode.fail) {
                    if (callback != null) {
                        callback(res.message, null);
                    }
                }
                else if (res.code === httpStatusCode_1.HttpStatusCode.success) {
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
        gateEnter(msg) {
            let self = this;
            let result = new Promise((resolve, rejected) => {
                if (!!self.socket && this._isConnected === false) {
                    // <!-- Quering connector server.
                    self.socket.request("gate.gateHandler.queryEntry", msg, function (result) {
                        console.log("gateEnter", result);
                        if (result.code === httpStatusCode_1.HttpStatusCode.success) {
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
        TokenAuthen(tokenBearer, checkTokenCallback) {
            let self = this;
            let msg = {};
            msg["token"] = tokenBearer;
            self.socket.request("gate.gateHandler.authenGateway", msg, (result) => {
                this.OnTokenAuthenticate(result, checkTokenCallback);
            });
        }
        OnTokenAuthenticate(tokenRes, onSuccessCheckToken) {
            if (tokenRes.code === httpStatusCode_1.HttpStatusCode.success) {
                var data = tokenRes.data;
                var decode = data.decoded; //["decoded"];
                var decodedModel = JSON.parse(JSON.stringify(decode));
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
        kickMeAllSession(uid) {
            let self = this;
            if (self.socket !== null) {
                var msg = { uid: uid };
                self.socket.request("connector.entryHandler.kickMe", msg, function (result) {
                    console.log("kickMe", JSON.stringify(result));
                });
            }
        }
    }
    Stalk.ServerImplemented = ServerImplemented;
    class ServerParam {
    }
    Stalk.ServerParam = ServerParam;
})(Stalk = exports.Stalk || (exports.Stalk = {}));
