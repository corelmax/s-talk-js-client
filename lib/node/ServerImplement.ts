/**
 * Stalk-JavaScript, Node.js client. Supported express.js framework.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */

import * as EventEmitter from "events";
import { IServerImp } from "../Base/IServerImp";
import { HttpStatusCode } from "../utils/httpStatusCode";
import { Authen } from "../utils/tokenDecode";
import { IPomeloResponse, IPomelo, ServerParam } from "../utils/PomeloUtils";

const Pomelo = require("../pomelo/nodeWSClient");
const Config = require(dirname + "/stalk_config.json");

/**
 * @deprecated Use es6 Map instead.
 */
export interface IDictionary {
    [k: string]: any;
}

export class ServerImplement implements IServerImp {
    private static Instance: ServerImplement;
    public static getInstance(): ServerImplement {
        if (this.Instance === null || this.Instance === undefined) {
            this.Instance = new ServerImplement();
        }

        return this.Instance;
    }

    static connectionProblemString: string = "Server connection is unstable.";

    socket: IPomelo;
    public getSocket() {
        if (this.socket !== null) {
            return this.socket;
        }
        else {
            throw new Error("No socket instance!");
        }
    }
    host: string;
    port: number | string;
    _isConnected = false;
    _isLogedin = false;
    connect = this.connectServer;

    constructor() {
        console.log("serv imp. constructor");
    }

    public dispose() {
        console.warn("dispose socket client.");

        this.disConnect();

        delete ServerImplement.Instance;
    }

    public disConnect(callBack?: Function) {
        let self = this;
        if (!!self.socket) {
            self.socket.removeAllListeners();
            self.socket.disconnect().then(() => {
                if (callBack)
                    callBack();
            });
        }
        else {
            if (callBack)
                callBack();
        }
    }

    public logout() {
        console.log("logout request");

        let self = this;
        let registrationId = "";
        let msg: IDictionary = {};
        msg["username"] = this.username;
        msg["registrationId"] = registrationId;
        if (self.socket != null)
            self.socket.notify("connector.entryHandler.logout", msg);

        this.disConnect();
        delete self.socket;
    }

    public init(callback: (err, res) => void) {
        console.log("serverImp.init()");

        let self = this;
        this._isConnected = false;
        self.socket = Pomelo;

        self.host = Config.Stalk.chat;
        self.port = parseInt(Config.Stalk.port);
        if (!!self.socket) {
            // <!-- Connecting gate server.
            let params: IPomeloParam = { host: self.host, port: self.port, reconnect: false };
            self.connectServer(params, (err) => {
                callback(err, self);
            });
        }
        else {
            console.warn("pomelo socket is un ready.");
        }
    }

    private connectServer(params: IPomeloParam, callback: (err) => void) {
        let self = this;
        console.log("socket connecting to: ", params);

        self.socket.init(params, function cb(err) {
            if (err) {
                console.warn("socket init result: ", err.message);
            }

            callback(err);
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
                    let params: IPomeloParam = { host: self.host, port: connectorPort, reconnect: true };
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

        let msg: IDictionary = {};
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

                self.socket.on("disconnect", function data(reason) {
                    self._isConnected = false;
                });
            }
            else {
                if (callback !== null) {
                    callback(null, res);
                }
            }
        });
    }

    public gateEnter(uid: string): Promise<any> {
        let self = this;

        let msg = { uid: uid };
        return new Promise((resolve, rejected) => {
            if (!!self.socket && this._isConnected === false) {
                // <!-- Quering connector server.
                self.socket.request("gate.gateHandler.queryEntry", msg, function (result) {

                    console.log("gateEnter", JSON.stringify(result));

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
                // self.init((err, res) => {
                //     if (err) {
                //         console.warn("Cannot starting pomelo socket!");

                //         rejected(err);
                //     }
                //     else {
                //         console.log("Init socket success.");
                //         resolve();
                //     }
                // });
            }
        });
    }

    public connectorEnter(msg: IDictionary): Promise<any> {
        let self = this;

        return new Promise((resolve, rejected) => {
            // <!-- Authentication.
            self.socket.request("connector.entryHandler.login", msg, function (res) {
                if (res.code === HttpStatusCode.fail) {
                    rejected(res.message);
                }
                else if (res.code === HttpStatusCode.success) {
                    resolve(res);

                    self.socket.on("disconnect", function data(reason) {
                        self._isConnected = false;
                    });
                }
                else {
                    resolve(res);
                }
            });
        });
    }

    public TokenAuthen(tokenBearer: string, checkTokenCallback: (err, res) => void) {
        let self = this;
        let msg: IDictionary = {};
        msg["token"] = tokenBearer;
        self.socket.request("gate.gateHandler.authenGateway", msg, (result) => {
            this.OnTokenAuthenticate(result, checkTokenCallback);
        });
    }

    private OnTokenAuthenticate(tokenRes: any, onSuccessCheckToken: (err, res) => void) {
        if (tokenRes.code === HttpStatusCode.success) {
            let data = tokenRes.data;
            let decode = data.decoded; // ["decoded"];
            let decodedModel = JSON.parse(JSON.stringify(decode)) as Authen.TokenDecoded;
            if (onSuccessCheckToken != null)
                onSuccessCheckToken(null, { success: true, username: decodedModel.email, password: decodedModel.password });
        }
        else {
            if (onSuccessCheckToken != null)
                onSuccessCheckToken(tokenRes, null);
        }
    }

    public kickMeAllSession(uid: string) {
        let self = this;
        if (self.socket !== null) {
            let msg = { uid: uid };
            self.socket.request("connector.entryHandler.kickMe", msg, function (result) {
                console.log("kickMe", JSON.stringify(result));
            });
        }
    }
}
