/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 * Maintained by nattapon.r@live.com
 */
import { ServerImp, IPomelo, IServer } from "../stalkjs";
import { DataListener } from "./DataListener";
import { PushDataListener } from "./PushDataListener";
import { ServerEventListener } from "./ServerEventListener";
export interface IStalkConfig {
    apiKey: string;
    apiVersion: string;
    appId: string;
    chat: string;
    port: number;
}
export interface IApiConfig {
    apiKey: string;
    host: string;
    api: string;
    auth: string;
    user: string;
    team: string;
    group: string;
    orgChart: string;
    chatroom: string;
    message: string;
    fileUpload: string;
}
export declare class BackendFactory {
    private static instance;
    static getInstance(): BackendFactory;
    static createInstance(stalkConfig: IStalkConfig, apiConfig: IApiConfig): BackendFactory;
    config: IStalkConfig;
    private apiConfig;
    getApiConfig(): IApiConfig;
    stalk: ServerImp;
    serverEventsListener: ServerEventListener;
    pushDataListener: PushDataListener;
    dataListener: DataListener;
    constructor(config: IStalkConfig, apiConfig: IApiConfig);
    getServer(): ServerImp | null;
    stalkInit(): Promise<IPomelo>;
    handshake(uid: string): Promise<IServer>;
    checkIn(user: any): Promise<{}>;
    private checkOut;
    /**
     * @returns
     *
     * @memberof BackendFactory
     */
    logout(): Promise<void>;
    getServerListener(): ServerEventListener;
    subscriptions(): void;
}
