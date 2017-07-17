"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var serverImplemented_1 = require("../libs/stalk/serverImplemented");
var chatRoomApiProvider_1 = require("../libs/stalk/chatRoomApiProvider");
var serverEventListener_1 = require("../libs/stalk/serverEventListener");
var dataManager_1 = require("./dataManager");
var dataListener_1 = require("./dataListener");
var pushDataListener_1 = require("./pushDataListener");
var BackendFactory = (function () {
    function BackendFactory(token) {
        if (token === void 0) { token = null; }
        console.log('BackendFactory: ', token);
        this.stalk = serverImplemented_1.default.getInstance();
        this.pushDataListener = new pushDataListener_1.default();
        this.dataManager = new dataManager_1.default();
        this.dataListener = new dataListener_1.default(this.dataManager);
        // if (CONFIG.backend.parse) {
        //   return new Parse(token);
        // }
        // else if (CONFIG.backend.hapiLocal || CONFIG.backend.hapiRemote) {
        //   return new Hapi(token);
        // }
    }
    BackendFactory.getInstance = function () {
        if (BackendFactory.instance == null || BackendFactory.instance == undefined) {
            BackendFactory.instance = new BackendFactory();
        }
        return BackendFactory.instance;
    };
    BackendFactory.prototype.getServer = function () {
        var _this = this;
        return new Promise(function (resolve, rejected) {
            if (_this.stalk._isConnected)
                resolve(_this.stalk);
            else
                rejected();
        });
    };
    BackendFactory.prototype.getChatApi = function () {
        if (!this.chatRoomApiProvider) {
            this.chatRoomApiProvider = new chatRoomApiProvider_1.default(this.stalk.getClient());
        }
        return this.chatRoomApiProvider;
    };
    BackendFactory.prototype.getServerListener = function () {
        if (!this.serverEventsListener) {
            this.serverEventsListener = new serverEventListener_1.default(this.stalk.getClient());
        }
        return this.serverEventsListener;
    };
    BackendFactory.prototype.stalkInit = function () {
        console.log('stalkInit...');
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            self.stalk.disConnect(function done() {
                self.stalk.init(function (err, res) {
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
    };
    BackendFactory.prototype.login = function (username, hexPassword, deviceToken) {
        var email = username;
        var promise = new Promise(function executor(resolve, reject) {
            serverImplemented_1.default.getInstance().logIn(email, hexPassword, deviceToken, function (err, res) {
                if (!!err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
        return promise;
    };
    BackendFactory.prototype.loginByToken = function (tokenBearer) {
        var token = tokenBearer;
        var promise = new Promise(function (resolved, rejected) {
            console.warn(token);
            serverImplemented_1.default.getInstance().TokenAuthen(token, function (err, res) {
                if (!!err) {
                    rejected(err);
                }
                else {
                    resolved(res);
                }
            });
        });
        return promise;
    };
    BackendFactory.prototype.logout = function () {
        var self = this;
        var promise = new Promise(function exe(resolve, reject) {
            if (serverImplemented_1.default.getInstance) {
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
    };
    BackendFactory.prototype.startChatServerListener = function (resolve) {
        this.serverEventsListener.addFrontendListener(this.dataManager);
        this.serverEventsListener.addServerListener(this.dataListener);
        this.serverEventsListener.addChatListener(this.dataListener);
        this.serverEventsListener.addPushListener(this.pushDataListener);
        this.serverEventsListener.addListenner(resolve);
    };
    BackendFactory.prototype.checkIn = function (uid, token) {
        var self = this;
        return new Promise(function (resolve, rejected) {
            self.stalk.gateEnter(uid).then(function (value) {
                //<!-- Connecting to connector server.
                var params = { host: value.host, port: value.port, reconnect: false };
                self.stalk.connect(params, function (err) {
                    self.stalk._isConnected = true;
                    if (!!self.stalk.pomelo)
                        self.stalk.pomelo.setReconnect(true);
                    if (!!err) {
                        rejected(err);
                    }
                    else {
                        var msg = {};
                        msg["token"] = token;
                        self.stalk.connectorEnter(msg).then(function (value) {
                            resolve(value);
                        }).catch(function (err) {
                            rejected(err);
                        });
                    }
                });
            }).catch(function (err) {
                console.warn("Cannot connect gate-server.", err);
                rejected(err);
            });
        });
    };
    return BackendFactory;
}());
exports.default = BackendFactory;
