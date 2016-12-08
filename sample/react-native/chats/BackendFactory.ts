/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */

import Stalk, { IPomeloParam } from '../libs/stalk/serverImplemented';
import ChatRoomApiProvider from '../libs/stalk/chatRoomApiProvider';
import ServerEventListener from "../libs/stalk/serverEventListener";
import DataManager from "./dataManager";
import DataListener from "./dataListener";
import PushDataListener from "./pushDataListener";

import CONFIG from '../configs/config';

export default class BackendFactory {
    private static instance: BackendFactory;
    public static getInstance(): BackendFactory {
        if (BackendFactory.instance == null || BackendFactory.instance == undefined) {
            BackendFactory.instance = new BackendFactory();
        }

        return BackendFactory.instance;
    }

    stalk: Stalk;
    chatRoomApiProvider: ChatRoomApiProvider;
    serverEventsListener: ServerEventListener;
    pushDataListener: PushDataListener;
    dataManager: DataManager;
    dataListener: DataListener;

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

    getServer(): Promise<Stalk> {
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

    stalkInit(): Promise<any> {
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

    login(username: string, hexPassword: string, deviceToken: string): Promise<any> {
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

    loginByToken(tokenBearer: string): Promise<any> {
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

            if (!!self.pushDataListener) self.pushDataListener = null;
            if (!!self.dataManager) self.dataManager = null;
            if (!!self.dataListener) self.dataListener = null;

            BackendFactory.instance = null;
            resolve();
        });

        return promise;
    }

    startChatServerListener(resolve?) {
        this.serverEventsListener.addFrontendListener(this.dataManager);
        this.serverEventsListener.addServerListener(this.dataListener);
        this.serverEventsListener.addChatListener(this.dataListener);
        this.serverEventsListener.addPushListener(this.pushDataListener);

        this.serverEventsListener.addListenner(resolve);
    }

    checkIn(uid: string, token: string) {
        let self = this;
        return new Promise((resolve: (data: any) => void, rejected) => {
            self.stalk.gateEnter(uid).then(value => {
                //<!-- Connecting to connector server.
                let params: IPomeloParam = { host: value.host, port: value.port, reconnect: false };
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