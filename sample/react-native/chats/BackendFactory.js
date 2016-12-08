/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
import Stalk from '../libs/stalk/serverImplemented';
import ChatRoomApiProvider from '../libs/stalk/chatRoomApiProvider';
import ServerEventListener from "../libs/stalk/serverEventListener";
import DataManager from "./dataManager";
import DataListener from "./dataListener";
import PushDataListener from "./pushDataListener";
export default class BackendFactory {
    constructor(token = null) {
        console.log('BackendFactory: ', token);
        this.stalk = Stalk.getInstance();
        this.pushDataListener = new PushDataListener();
        this.dataManager = new DataManager();
        this.dataListener = new DataListener(this.dataManager);
        // if (CONFIG.backend.parse) {
        //   return new Parse(token);
        // }
        // else if (CONFIG.backend.hapiLocal || CONFIG.backend.hapiRemote) {
        //   return new Hapi(token);
        // }
    }
    static getInstance() {
        if (BackendFactory.instance == null || BackendFactory.instance == undefined) {
            BackendFactory.instance = new BackendFactory();
        }
        return BackendFactory.instance;
    }
    getServer() {
        return new Promise((resolve, rejected) => {
            if (this.stalk._isConnected)
                resolve(this.stalk);
            else
                rejected();
        });
    }
    getChatApi() {
        if (!this.chatRoomApiProvider) {
            this.chatRoomApiProvider = new ChatRoomApiProvider(this.stalk.getClient());
        }
        return this.chatRoomApiProvider;
    }
    getServerListener() {
        if (!this.serverEventsListener) {
            this.serverEventsListener = new ServerEventListener(this.stalk.getClient());
        }
        return this.serverEventsListener;
    }
    stalkInit() {
        console.log('stalkInit...');
        let self = this;
        let promise = new Promise((resolve, reject) => {
            self.stalk.disConnect(function done() {
                self.stalk.init((err, res) => {
                    if (!!err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        });
        return promise;
    }
    login(username, hexPassword, deviceToken) {
        let email = username;
        let promise = new Promise(function executor(resolve, reject) {
            Stalk.getInstance().logIn(email, hexPassword, deviceToken, (err, res) => {
                if (!!err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
        return promise;
    }
    loginByToken(tokenBearer) {
        let token = tokenBearer;
        let promise = new Promise((resolved, rejected) => {
            console.warn(token);
            Stalk.getInstance().TokenAuthen(token, (err, res) => {
                if (!!err) {
                    rejected(err);
                }
                else {
                    resolved(res);
                }
            });
        });
        return promise;
    }
    logout() {
        let self = this;
        let promise = new Promise(function exe(resolve, reject) {
            if (Stalk.getInstance) {
                if (!!self.stalk.pomelo)
                    self.stalk.pomelo.setReconnect(false);
                self.stalk.logout();
                self.stalk.dispose();
            }
            if (!!self.pushDataListener)
                self.pushDataListener = null;
            if (!!self.dataManager)
                self.dataManager = null;
            if (!!self.dataListener)
                self.dataListener = null;
            BackendFactory.instance = null;
            resolve();
        });
        return promise;
    }
    startChatServerListener(resolve) {
        this.serverEventsListener.addFrontendListener(this.dataManager);
        this.serverEventsListener.addServerListener(this.dataListener);
        this.serverEventsListener.addChatListener(this.dataListener);
        this.serverEventsListener.addPushListener(this.pushDataListener);
        this.serverEventsListener.addListenner(resolve);
    }
    checkIn(uid, token) {
        let self = this;
        return new Promise((resolve, rejected) => {
            self.stalk.gateEnter(uid).then(value => {
                //<!-- Connecting to connector server.
                let params = { host: value.host, port: value.port, reconnect: false };
                self.stalk.connect(params, (err) => {
                    self.stalk._isConnected = true;
                    if (!!self.stalk.pomelo)
                        self.stalk.pomelo.setReconnect(true);
                    if (!!err) {
                        rejected(err);
                    }
                    else {
                        let msg = {};
                        msg["token"] = token;
                        self.stalk.connectorEnter(msg).then(value => {
                            resolve(value);
                        }).catch(err => {
                            rejected(err);
                        });
                    }
                });
            }).catch(err => {
                console.warn("Cannot connect gate-server.", err);
                rejected(err);
            });
        });
    }
}
