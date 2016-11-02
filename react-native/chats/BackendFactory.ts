/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */

import Stalk, { IPomeloParam } from '../libs/stalk/serverImplemented';
import ChatRoomApiProvider from '../libs/stalk/chatRoomApiProvider';
import ServerEventListener from "../libs/stalk/serverEventListener";
import DataManager from "./dataManager";
import DataListener from "./dataListener";

import CONFIG from '../configs/config';

//import Parse from './Parse';
//import Hapi from './Hapi';

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

    constructor(token = null) {
        console.log('BackendFactory: ', token);

        this.stalk = Stalk.getInstance();

        // if (CONFIG.backend.parse) {
        //   return new Parse(token);
        // }
        // else if (CONFIG.backend.hapiLocal || CONFIG.backend.hapiRemote) {
        //   return new Hapi(token);
        // }
    }

    getServer() { return this.stalk; }

    getChatApi() {
        if (!this.chatRoomApiProvider) {
            this.chatRoomApiProvider = new ChatRoomApiProvider(this.getServer().getClient());
        }
        return this.chatRoomApiProvider;
    }

    getServerListener() {
        if (!this.serverEventsListener) {
            this.serverEventsListener = new ServerEventListener(this.getServer().getClient());
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

            resolve();
        });

        return promise;
    }

    startChatServerListener(resolve?) {
        this.serverEventsListener.addFrontendListener(DataManager.getInstance());
        this.serverEventsListener.addServerListener(DataListener.getInstance());
        this.serverEventsListener.addChatListener(DataListener.getInstance());

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