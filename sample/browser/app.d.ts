/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
import { ServerImp, IDictionary, IPomelo, PushEvents, StalkEvents, ChatEvents, PushAPI, ChatRoomAPI } from "stalk-js";
export declare namespace StalkCodeExam {
    /**
     * Preparing connection...
     */
    class Factory {
        stalk: ServerImp;
        constructor(host: string, port: number);
        stalkInit(): Promise<any>;
        handshake(uid: string): Promise<any>;
        checkIn(user: any): Promise<any>;
        checkOut(): Promise<void>;
    }
    /**
     * Listenning for messages...
     */
    class ServerListener {
        socket: IPomelo;
        private pushServerListener;
        private serverListener;
        private chatServerListener;
        constructor(socket: IPomelo);
        addPushListener(obj: PushEvents.IPushServerListener): void;
        addServerListener(obj: StalkEvents.BaseEvents): void;
        addChatListener(obj: ChatEvents.IChatServerEvents): void;
    }
}
export declare class YourApp {
    exam: StalkCodeExam.Factory;
    listeners: StalkCodeExam.ServerListener;
    chatApi: ChatRoomAPI;
    pushApi: PushAPI;
    constructor();
    /**
     *
     * login to stalk.
     */
    stalkLogin(user: any): void;
    /**
     * logout and disconnections.
     */
    stalkLogout(): void;
    chat(message: any): void;
    push(message: IDictionary): void;
}
