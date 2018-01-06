/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 * Maintained by nattapon.r@live.com
 */

import { stalkjs, ServerImp, ServerParam, IDictionary, IPomelo, IServer } from "../index";
import { DataListener } from "./DataListener";
import { PushDataListener } from "./PushDataListener";
import { ChatsLogComponent } from "./simpleChat/ChatslogComponent";
import { ServerEventListener } from "./ServerEventListener";

export interface IStalkApi {
    apiKey: string;
    apiVersion: string;
    appId: string;
    chat: string;
    port: number;
}

export class BackendFactory {
    private static instance: BackendFactory;
    public static getInstance(): BackendFactory {
        return BackendFactory.instance;
    }
    public static createInstance(config: IStalkApi): BackendFactory {
        if (!BackendFactory.instance) {
            BackendFactory.instance = new BackendFactory(config);
        }

        return BackendFactory.instance;
    }

    config: IStalkApi;
    stalk: ServerImp;
    serverEventsListener: ServerEventListener;
    pushDataListener: PushDataListener;
    dataListener: DataListener;
    chatLogComp: ChatsLogComponent;

    constructor(config: IStalkApi) {
        this.config = config;
        this.pushDataListener = new PushDataListener();
        this.dataListener = new DataListener();
    }

    getServer() {
        if (this.stalk._isConnected) {
            return this.stalk;
        }
        else {
            console.log("Stalk connection not yet ready.");
            return null;
        }
    }

    async stalkInit() {
        this.stalk = stalkjs.create(this.config.chat, this.config.port);
        let socket = await stalkjs.init(this.stalk);
        return socket;
    }

    async handshake(uid: string) {
        try {
            // @ get connector server.
            let msg = {} as IDictionary;
            msg["uid"] = uid;
            msg["x-api-key"] = this.config.apiKey;
            msg["x-api-version"] = this.config.apiVersion;
            msg["x-app-id"] = this.config.appId;
            let connector = await stalkjs.geteEnter(this.stalk, msg);

            let params = { host: connector.host, port: connector.port, reconnect: false } as ServerParam;
            await stalkjs.handshake(this.stalk, params);

            return await connector;
        } catch (ex) {
            throw new Error("handshake fail: " + ex.message);
        }
    }

    async checkIn(user: any) {
        let msg = {} as IDictionary;
        msg["user"] = user;
        msg["x-api-key"] = this.config.apiKey;
        msg["x-api-version"] = this.config.apiVersion;
        msg["x-app-id"] = this.config.appId;
        let result = await stalkjs.checkIn(this.stalk, msg);
        return result;
    }

    private async checkOut() {
        await stalkjs.checkOut(this.stalk);
    }

    /**
     * @returns
     *
     * @memberof BackendFactory
     */
    logout() {
        let self = this;
        self.checkOut();
        if (!!self.pushDataListener) { delete self.pushDataListener; }
        if (!!self.dataListener) { delete self.dataListener; }

        delete BackendFactory.instance;

        return Promise.resolve();
    }

    createChatlogs() {
        this.chatLogComp = new ChatsLogComponent();

        return this.chatLogComp;
    }

    getServerListener() {
        if (!this.serverEventsListener) {
            this.serverEventsListener = new ServerEventListener(this.stalk.getSocket());
        }

        return this.serverEventsListener;
    }

    subscriptions() {
        this.serverEventsListener.addServerListener(this.dataListener);
        this.serverEventsListener.addChatListener(this.dataListener);
        this.serverEventsListener.addPushListener(this.pushDataListener);
    }
}
