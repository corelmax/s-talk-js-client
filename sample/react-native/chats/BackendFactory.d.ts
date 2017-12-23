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
    private static instance;
    static getInstance(): BackendFactory;
    stalk: Stalk;
    chatRoomApiProvider: ChatRoomApiProvider;
    serverEventsListener: ServerEventListener;
    pushDataListener: PushDataListener;
    dataManager: DataManager;
    dataListener: DataListener;
    constructor(token?: null);
    getServer(): Promise<Stalk>;
    getChatApi(): any;
    getServerListener(): any;
    stalkInit(): Promise<any>;
    login(username: string, hexPassword: string, deviceToken: string): Promise<any>;
    loginByToken(tokenBearer: string): Promise<any>;
    logout(): any;
    startChatServerListener(resolve?: any): void;
    checkIn(uid: string, token: string): any;
}
