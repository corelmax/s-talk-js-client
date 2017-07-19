"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var httpStatusCode_1 = require("../utils/httpStatusCode");
var API_1 = require("./API");
var Pomelo = require("../pomelo/reactWSClient");
;
;
var Stalk;
(function (Stalk) {
    var ServerImplemented = (function () {
        function ServerImplemented(host, port) {
            this._isConnected = false;
            this._isLogedin = false;
            this.connect = this.connectServer;
            console.log("ServerImp", host, port);
            this.host = host;
            this.port = port;
            this.lobby = new API_1.API.LobbyAPI(this);
            this.chatroomAPI = new API_1.API.ChatRoomAPI(this);
            this.callingAPI = new API_1.API.CallingAPI(this);
            this.connectServer = this.connectServer.bind(this);
            this.listenSocketEvents = this.listenSocketEvents.bind(this);
        }
        ServerImplemented.getInstance = function () {
            return this.Instance;
        };
        ServerImplemented.createInstance = function (host, port) {
            if (this.Instance === null || this.Instance === undefined) {
                this.Instance = new ServerImplemented(host, port);
                return this.Instance;
            }
        };
        ServerImplemented.prototype.getSocket = function () {
            if (this.socket !== null) {
                return this.socket;
            }
            else {
                throw new Error("No socket instance!");
            }
        };
        ServerImplemented.prototype.getLobby = function () {
            return this.lobby;
        };
        ServerImplemented.prototype.getChatRoomAPI = function () {
            return this.chatroomAPI;
        };
        ServerImplemented.prototype.getCallingAPI = function () {
            return this.callingAPI;
        };
        ServerImplemented.prototype.dispose = function () {
            console.warn("dispose socket client.");
            this.disConnect();
            this.authenData = null;
            ServerImplemented.Instance = null;
        };
        ServerImplemented.prototype.disConnect = function (callBack) {
            var self = this;
            if (!!self.socket) {
                self.socket.removeAllListeners();
                self.socket.disconnect().then(function () {
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
        };
        ServerImplemented.prototype.init = function (callback) {
            var self = this;
            this._isConnected = false;
            this.socket = Pomelo;
            console.log("stalkInit...");
            if (!!self.socket) {
                // <!-- Connecting gate server.
                var params = { host: self.host, port: self.port, reconnect: false };
                self.connectServer(params, function (err) {
                    callback(err, self.socket);
                });
            }
            else {
                console.warn("pomelo socket is un ready.");
            }
        };
        ServerImplemented.prototype.connectServer = function (params, callback) {
            var self = this;
            this.socket.init(params, function cb(err) {
                console.log("socket init... ", err);
                self.socket.setInitCallback(null);
                callback(err);
            });
        };
        ServerImplemented.prototype.listenSocketEvents = function () {
            var _this = this;
            this.socket.removeAllListeners();
            this.socket.on("onopen", (this.onSocketOpen) ?
                this.onSocketOpen : function (data) { return console.log("onopen", data); });
            this.socket.on("close", (!!this.onSocketClose) ?
                this.onSocketClose : function (data) {
                console.warn("close", data);
                _this.socket.setInitCallback(null);
            });
            this.socket.on("reconnect", (this.onSocketReconnect) ?
                this.onSocketReconnect : function (data) { return console.log("reconnect", data); });
            this.socket.on("disconnected", function (data) {
                console.warn("disconnected", data);
                _this._isConnected = false;
                _this.socket.setInitCallback(null);
                if (_this.onDisconnected) {
                    _this.onDisconnected(data);
                }
            });
            this.socket.on("io-error", function (data) {
                console.warn("io-error", data);
                _this.socket.setInitCallback(null);
            });
        };
        // region <!-- Authentication...
        /// <summary>
        /// Connect to gate server then get query of connector server.
        /// </summary>
        ServerImplemented.prototype.logIn = function (_username, _hash, deviceToken, callback) {
            var self = this;
            if (!!self.socket && this._isConnected === false) {
                var msg = { uid: _username };
                // <!-- Quering connector server.
                self.socket.request("gate.gateHandler.queryEntry", msg, function (result) {
                    console.log("QueryConnectorServ", JSON.stringify(result));
                    if (result.code === httpStatusCode_1.HttpStatusCode.success) {
                        self.disConnect();
                        var connectorPort = result.port;
                        // <!-- Connecting to connector server.
                        var params = { host: self.host, port: connectorPort, reconnect: true };
                        self.connectServer(params, function (err) {
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
                self.init(function (err, res) {
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
        };
        // <!-- Authentication. request for token sign.
        ServerImplemented.prototype.authenForFrontendServer = function (_username, _hash, deviceToken, callback) {
            var self = this;
            var msg = {};
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
        };
        ServerImplemented.prototype.gateEnter = function (msg) {
            var _this = this;
            var self = this;
            var result = new Promise(function (resolve, rejected) {
                if (!!self.socket && _this._isConnected === false) {
                    // <!-- Quering connector server.
                    self.socket.request("gate.gateHandler.queryEntry", msg, function (result) {
                        console.log("gateEnter", result);
                        if (result.code === httpStatusCode_1.HttpStatusCode.success) {
                            self.disConnect();
                            var data = { host: self.host, port: result.port };
                            resolve(data);
                        }
                        else {
                            rejected(result);
                        }
                    });
                }
                else {
                    var message = "pomelo client is null: connecting status is " + self._isConnected;
                    console.log("Automatic init pomelo socket...");
                    rejected(message);
                }
            });
            return result;
        };
        ServerImplemented.prototype.TokenAuthen = function (tokenBearer, checkTokenCallback) {
            var _this = this;
            var self = this;
            var msg = {};
            msg["token"] = tokenBearer;
            self.socket.request("gate.gateHandler.authenGateway", msg, function (result) {
                _this.OnTokenAuthenticate(result, checkTokenCallback);
            });
        };
        ServerImplemented.prototype.OnTokenAuthenticate = function (tokenRes, onSuccessCheckToken) {
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
        };
        ServerImplemented.prototype.kickMeAllSession = function (uid) {
            var self = this;
            if (self.socket !== null) {
                var msg = { uid: uid };
                self.socket.request("connector.entryHandler.kickMe", msg, function (result) {
                    console.log("kickMe", JSON.stringify(result));
                });
            }
        };
        return ServerImplemented;
    }());
    Stalk.ServerImplemented = ServerImplemented;
    var ServerParam = (function () {
        function ServerParam() {
        }
        return ServerParam;
    }());
    Stalk.ServerParam = ServerParam;
})(Stalk = exports.Stalk || (exports.Stalk = {}));
