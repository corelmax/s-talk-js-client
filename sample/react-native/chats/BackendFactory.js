/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
"use strict";
const serverImplemented_1 = require('../libs/stalk/serverImplemented');
const chatRoomApiProvider_1 = require('../libs/stalk/chatRoomApiProvider');
const serverEventListener_1 = require("../libs/stalk/serverEventListener");
const dataManager_1 = require("./dataManager");
const dataListener_1 = require("./dataListener");
//import Parse from './Parse';
//import Hapi from './Hapi';
class BackendFactory {
    constructor(token = null) {
        console.log('BackendFactory: ', token);
        this.stalk = serverImplemented_1.default.getInstance();
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
    getServer() { return this.stalk; }
    getChatApi() {
        if (!this.chatRoomApiProvider) {
            this.chatRoomApiProvider = new chatRoomApiProvider_1.default(this.getServer().getClient());
        }
        return this.chatRoomApiProvider;
    }
    getServerListener() {
        if (!this.serverEventsListener) {
            this.serverEventsListener = new serverEventListener_1.default(this.getServer().getClient());
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
            serverImplemented_1.default.getInstance().logIn(email, hexPassword, deviceToken, (err, res) => {
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
            serverImplemented_1.default.getInstance().TokenAuthen(token, (err, res) => {
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
            if (serverImplemented_1.default.getInstance) {
                if (!!self.stalk.pomelo)
                    self.stalk.pomelo.setReconnect(false);
                self.stalk.logout();
                self.stalk.dispose();
            }
            resolve();
        });
        return promise;
    }
    startChatServerListener(resolve) {
        this.serverEventsListener.addFrontendListener(dataManager_1.default.getInstance());
        this.serverEventsListener.addServerListener(dataListener_1.default.getInstance());
        this.serverEventsListener.addChatListener(dataListener_1.default.getInstance());
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BackendFactory;
