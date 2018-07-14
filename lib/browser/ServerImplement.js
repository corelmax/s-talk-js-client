/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
import * as API from "./api/index";
var Pomelo = require("../pomelo/reactWSClient");
var ServerImp = /** @class */ (function () {
    function ServerImp(host, port) {
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
    ServerImp.getInstance = function () {
        return this.Instance;
    };
    ServerImp.createInstance = function (host, port) {
        if (this.Instance === null || this.Instance === undefined) {
            this.Instance = new ServerImp(host, port);
            return this.Instance;
        }
        else {
            return this.Instance;
        }
    };
    ServerImp.prototype.getSocket = function () {
        if (this.socket !== null) {
            return this.socket;
        }
        else {
            throw new Error("No socket instance!");
        }
    };
    ServerImp.prototype.getGateAPI = function () { return this.gateAPI; };
    ServerImp.prototype.getLobby = function () { return this.lobby; };
    ServerImp.prototype.getChatRoomAPI = function () { return this.chatroomAPI; };
    ServerImp.prototype.getCallingAPI = function () { return this.callingAPI; };
    ServerImp.prototype.getPushApi = function () { return this.pushApi; };
    ServerImp.prototype.dispose = function () {
        console.warn("dispose socket client.");
        this.disConnect();
        delete ServerImp.Instance;
    };
    ServerImp.prototype.disConnect = function (callBack) {
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
    ServerImp.prototype.init = function (callback) {
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
    ServerImp.prototype.connectServer = function (params, callback) {
        var self = this;
        this.socket.init(params, function cb(err) {
            console.log("socket init... ", err);
            self.socket.setInitCallback();
            callback(err);
        });
    };
    ServerImp.prototype.listenSocketEvents = function () {
        var _this = this;
        this.socket.removeAllListeners();
        this.socket.on("onopen", (this.onSocketOpen) ?
            this.onSocketOpen : function (data) { return console.log("onopen", data); });
        this.socket.on("close", (!!this.onSocketClose) ?
            this.onSocketClose : function (data) {
            console.warn("close", data);
            _this.socket.setInitCallback();
        });
        this.socket.on("reconnect", (this.onSocketReconnect) ?
            this.onSocketReconnect : function (data) { return console.log("reconnect", data); });
        this.socket.on("disconnected", function (data) {
            console.warn("disconnected", data);
            _this._isConnected = false;
            _this.socket.setInitCallback();
            if (_this.onDisconnected) {
                _this.onDisconnected(data);
            }
        });
        this.socket.on("io-error", function (data) {
            console.warn("io-error", data);
            _this.socket.setInitCallback();
        });
    };
    return ServerImp;
}());
export { ServerImp };
