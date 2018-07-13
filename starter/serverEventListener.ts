/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 * Support by@ nattapon.r@live.com
 */

import { IPomelo, StalkEvents, ChatEvents, PushEvents, CallingEvents } from "../stalkjs";

export class ServerEventListener {
    // <!-- AccessRoom Info -->
    public static ON_ACCESS_ROOMS: string = "onAccessRooms";
    public static ON_ADD_ROOM_ACCESS: string = "onAddRoomAccess";
    public static ON_UPDATED_LASTACCESSTIME: string = "onUpdatedLastAccessTime";

    socket: IPomelo;

    constructor(socket: IPomelo) {
        this.socket = socket;
        this.serverListener = undefined as any;
        this.chatServerListener = undefined as any;
        this.rtcCallListener = undefined as any;
        this.pushServerListener = undefined as any;
    }

    /**
     * @private
     * @type {StalkEvents.IServerListener}
     * @memberof ServerEventListener
     */
    private serverListener: StalkEvents.IServerListener;
    public addServerListener(obj: StalkEvents.IServerListener): void {
        this.serverListener = obj;

        let self = this;

        // <!-- AccessRoom Info -->
        self.socket.on(ServerEventListener.ON_ACCESS_ROOMS, (data) => {
            console.log(ServerEventListener.ON_ACCESS_ROOMS, data);

            self.serverListener.onAccessRoom(data);
        });
        self.socket.on(ServerEventListener.ON_ADD_ROOM_ACCESS, (data) => {
            console.log(ServerEventListener.ON_ADD_ROOM_ACCESS, data);

            self.serverListener.onAddRoomAccess(data);
        });
        self.socket.on(ServerEventListener.ON_UPDATED_LASTACCESSTIME, (data) => {
            console.log(ServerEventListener.ON_UPDATED_LASTACCESSTIME, data);

            self.serverListener.onUpdatedLastAccessTime(data);
        });

        // <!-- User -->
        self.socket.on(StalkEvents.ON_USER_LOGIN, data => {
            self.serverListener.onActiveUser(StalkEvents.ON_USER_LOGIN, data);
        });
        self.socket.on(StalkEvents.ON_USER_LOGOUT, data => {
            self.serverListener.onActiveUser(StalkEvents.ON_USER_LOGOUT, data);
        });
    }

    /**
     * Chat server events.
     */
    private chatServerListener: ChatEvents.IChatServerEvents;
    public addChatListener(obj: ChatEvents.IChatServerEvents): void {
        this.chatServerListener = obj;

        let self = this;

        self.socket.on(ChatEvents.ON_CHAT, function (data) {
            console.log(ChatEvents.ON_CHAT, JSON.stringify(data));

            self.chatServerListener.onChat(data);
        });
        self.socket.on(ChatEvents.ON_ADD, (data) => {
            console.log(ChatEvents.ON_ADD, data);

            self.chatServerListener.onRoomJoin(data);
        });
        self.socket.on(ChatEvents.ON_LEAVE, (data) => {
            console.log(ChatEvents.ON_LEAVE, data);

            self.chatServerListener.onLeaveRoom(data);
        });
    }

    /**
     * VOIP service events.
     */
    private rtcCallListener: CallingEvents.ICallingListener;
    public addRTCListener(obj: CallingEvents.ICallingListener): void {
        this.rtcCallListener = obj;

        let self = this;
        self.socket.on(CallingEvents.ON_CALL, (data) => {
            console.log(CallingEvents.ON_CALL, JSON.stringify(data));
            self.rtcCallListener.onCall(data);
        });
    }

    /**
     * Push data events.
     */
    private pushServerListener: PushEvents.IPushServerListener;
    public addPushListener(obj: PushEvents.IPushServerListener) {
        this.pushServerListener = obj;

        let self = this;

        self.socket.on(PushEvents.ON_PUSH, function (data) {
            self.pushServerListener.onPush(data);
        });
    }
}
