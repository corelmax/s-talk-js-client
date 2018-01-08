"use strict";
/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 * Support by@ nattapon.r@live.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../lib/browser/index");
class ServerEventListener {
    constructor(socket) {
        this.socket = socket;
    }
    addServerListener(obj) {
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
        self.socket.on(index_1.StalkEvents.ON_USER_LOGIN, data => {
            console.log(index_1.StalkEvents.ON_USER_LOGIN);
            self.serverListener.onUserLogin(data);
        });
        self.socket.on(index_1.StalkEvents.ON_USER_LOGOUT, data => {
            console.log(index_1.StalkEvents.ON_USER_LOGOUT);
            self.serverListener.onUserLogout(data);
        });
    }
    addChatListener(obj) {
        this.chatServerListener = obj;
        let self = this;
        self.socket.on(index_1.ChatEvents.ON_CHAT, function (data) {
            console.log(index_1.ChatEvents.ON_CHAT, JSON.stringify(data));
            self.chatServerListener.onChat(data);
        });
        self.socket.on(index_1.ChatEvents.ON_ADD, (data) => {
            console.log(index_1.ChatEvents.ON_ADD, data);
            self.chatServerListener.onRoomJoin(data);
        });
        self.socket.on(index_1.ChatEvents.ON_LEAVE, (data) => {
            console.log(index_1.ChatEvents.ON_LEAVE, data);
            self.chatServerListener.onLeaveRoom(data);
        });
    }
    addRTCListener(obj) {
        this.rtcCallListener = obj;
        let self = this;
        self.socket.on(index_1.CallingEvents.ON_CALL, (data) => {
            console.log(index_1.CallingEvents.ON_CALL, JSON.stringify(data));
            self.rtcCallListener.onCall(data);
        });
    }
    addPushListener(obj) {
        this.pushServerListener = obj;
        let self = this;
        self.socket.on(index_1.PushEvents.ON_PUSH, function (data) {
            self.pushServerListener.onPush(data);
        });
    }
}
// <!-- AccessRoom Info -->
ServerEventListener.ON_ACCESS_ROOMS = "onAccessRooms";
ServerEventListener.ON_ADD_ROOM_ACCESS = "onAddRoomAccess";
ServerEventListener.ON_UPDATED_LASTACCESSTIME = "onUpdatedLastAccessTime";
exports.ServerEventListener = ServerEventListener;
