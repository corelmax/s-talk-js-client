/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
import { IDictionary, IServer, API, ServerImplemented, IPomelo, StalkEvents, PushEvents, ChatEvents } from "../../index";
export declare namespace StalkCodeExam {
    /**
     * Preparing connection...
     */
    class Factory {
        stalk: ServerImplemented;
        constructor(host: any, port: any);
        stalkInit(): Promise<IPomelo>;
        handshake(uid: string): Promise<IServer>;
        checkIn(user: any): Promise<{}>;
        checkOut(): Promise<void>;
    }
    /**
     * Listenning for messages...
     */
    class ServerListener {
        socket: IPomelo;
        constructor(socket: IPomelo);
        private pushServerListener;
        addPushListener(obj: PushEvents.IPushServerListener): void;
        private serverListener;
        addServerListener(obj: StalkEvents.BaseEvents): void;
        private chatServerListener;
        addChatListener(obj: ChatEvents.IChatServerEvents): void;
    }
}
export declare class YourApp {
    exam: StalkCodeExam.Factory;
    listeners: StalkCodeExam.ServerListener;
    chatApi: API.ChatRoomAPI;
    pushApi: API.PushAPI;
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
