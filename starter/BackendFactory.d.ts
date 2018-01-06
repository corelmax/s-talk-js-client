/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 * Maintained by nattapon.r@live.com
 */
import { ServerImp, IPomelo, IServer } from "../index";
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
export declare class BackendFactory {
    private static instance;
    static getInstance(): BackendFactory;
    static createInstance(config: IStalkApi): BackendFactory;
    config: IStalkApi;
    stalk: ServerImp;
    serverEventsListener: ServerEventListener;
    pushDataListener: PushDataListener;
    dataListener: DataListener;
    chatLogComp: ChatsLogComponent;
    constructor(config: IStalkApi);
    getServer(): ServerImp | null;
    stalkInit(): Promise<IPomelo>;
    handshake(uid: string): Promise<IServer>;
    checkIn(user: any): Promise<{}>;
    private checkOut();
    /**
     * @returns
     *
     * @memberof BackendFactory
     */
    logout(): Promise<void>;
    createChatlogs(): ChatsLogComponent;
    getServerListener(): ServerEventListener;
    subscriptions(): void;
}
