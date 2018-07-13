/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 * Support by@ nattapon.r@live.com
 */
import { IPomelo, StalkEvents, ChatEvents, PushEvents, CallingEvents } from "../stalkjs";
export declare class ServerEventListener {
    static ON_ACCESS_ROOMS: string;
    static ON_ADD_ROOM_ACCESS: string;
    static ON_UPDATED_LASTACCESSTIME: string;
    socket: IPomelo;
    constructor(socket: IPomelo);
    /**
     * @private
     * @type {StalkEvents.IServerListener}
     * @memberof ServerEventListener
     */
    private serverListener;
    addServerListener(obj: StalkEvents.IServerListener): void;
    /**
     * Chat server events.
     */
    private chatServerListener;
    addChatListener(obj: ChatEvents.IChatServerEvents): void;
    /**
     * VOIP service events.
     */
    private rtcCallListener;
    addRTCListener(obj: CallingEvents.ICallingListener): void;
    /**
     * Push data events.
     */
    private pushServerListener;
    addPushListener(obj: PushEvents.IPushServerListener): void;
}
