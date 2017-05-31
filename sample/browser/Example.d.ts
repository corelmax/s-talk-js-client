/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
import { IServer, ServerImplemented, IPomelo, StalkEvents, PushEvents, ChatEvents } from "../../index";
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
        private checkOut();
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
/**
 *
 * login to stalk.
 */
export declare function stalkLogin(user: any): void;
