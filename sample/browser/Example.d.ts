/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
import { Stalk, IDictionary, IServer, API, IPomelo, StalkEvents, PushEvents, ChatEvents } from "../../index";
export declare namespace StalkCodeExam {
    /**
     * Preparing connection...
     */
    class Factory {
        stalk: Stalk.ServerImplemented;
        constructor(host: string, port: number);
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
