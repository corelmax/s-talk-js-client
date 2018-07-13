/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
import { API } from "./API";
const Pomelo = require("../pomelo/reactWSClient");
export var Stalk;
(function (Stalk) {
    class ServerImplemented {
        constructor(host, port) {
            this._isConnected = false;
            this._isLogedin = false;
            this.connect = this.connectServer;
            console.log("ServerImp", host, port);
            this.socket = undefined;
            this.onSocketOpen = undefined;
            this.onSocketClose = undefined;
            this.onSocketReconnect = undefined;
            this.onDisconnected = undefined;
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
        static getInstance() {
            return this.Instance;
        }
        static createInstance(host, port) {
            if (this.Instance === null || this.Instance === undefined) {
                this.Instance = new ServerImplemented(host, port);
                return this.Instance;
            }
            else {
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
        getGateAPI() { return this.gateAPI; }
        getLobby() { return this.lobby; }
        getChatRoomAPI() { return this.chatroomAPI; }
        getCallingAPI() { return this.callingAPI; }
        getPushApi() { return this.pushApi; }
        dispose() {
            console.warn("dispose socket client.");
            this.disConnect();
            delete ServerImplemented.Instance;
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
                self.socket.setInitCallback();
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
                this.socket.setInitCallback();
            });
            this.socket.on("reconnect", (this.onSocketReconnect) ?
                this.onSocketReconnect : (data) => console.log("reconnect", data));
            this.socket.on("disconnected", (data) => {
                console.warn("disconnected", data);
                this._isConnected = false;
                this.socket.setInitCallback();
                if (this.onDisconnected) {
                    this.onDisconnected(data);
                }
            });
            this.socket.on("io-error", (data) => {
                console.warn("io-error", data);
                this.socket.setInitCallback();
            });
        }
    }
    Stalk.ServerImplemented = ServerImplemented;
})(Stalk || (Stalk = {}));
