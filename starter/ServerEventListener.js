/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 * Support by@ nattapon.r@live.com
 */
import { StalkEvents, ChatEvents, PushEvents, CallingEvents } from "../lib/browser/index";
var ServerEventListener = /** @class */ (function () {
    function ServerEventListener(socket) {
        this.socket = socket;
        this.serverListener = undefined;
        this.chatServerListener = undefined;
        this.rtcCallListener = undefined;
        this.pushServerListener = undefined;
    }
    ServerEventListener.prototype.addServerListener = function (obj) {
        this.serverListener = obj;
        var self = this;
        // <!-- AccessRoom Info -->
        self.socket.on(ServerEventListener.ON_ACCESS_ROOMS, function (data) {
            console.log(ServerEventListener.ON_ACCESS_ROOMS, data);
            self.serverListener.onAccessRoom(data);
        });
        self.socket.on(ServerEventListener.ON_ADD_ROOM_ACCESS, function (data) {
            console.log(ServerEventListener.ON_ADD_ROOM_ACCESS, data);
            self.serverListener.onAddRoomAccess(data);
        });
        self.socket.on(ServerEventListener.ON_UPDATED_LASTACCESSTIME, function (data) {
            console.log(ServerEventListener.ON_UPDATED_LASTACCESSTIME, data);
            self.serverListener.onUpdatedLastAccessTime(data);
        });
        // <!-- User -->
        self.socket.on(StalkEvents.ON_USER_LOGIN, function (data) {
            self.serverListener.onActiveUser(StalkEvents.ON_USER_LOGIN, data);
        });
        self.socket.on(StalkEvents.ON_USER_LOGOUT, function (data) {
            self.serverListener.onActiveUser(StalkEvents.ON_USER_LOGOUT, data);
        });
    };
    ServerEventListener.prototype.addChatListener = function (obj) {
        this.chatServerListener = obj;
        var self = this;
        self.socket.on(ChatEvents.ON_CHAT, function (data) {
            console.log(ChatEvents.ON_CHAT, JSON.stringify(data));
            self.chatServerListener.onChat(data);
        });
        self.socket.on(ChatEvents.ON_ADD, function (data) {
            console.log(ChatEvents.ON_ADD, data);
            self.chatServerListener.onRoomJoin(data);
        });
        self.socket.on(ChatEvents.ON_LEAVE, function (data) {
            console.log(ChatEvents.ON_LEAVE, data);
            self.chatServerListener.onLeaveRoom(data);
        });
    };
    ServerEventListener.prototype.addRTCListener = function (obj) {
        this.rtcCallListener = obj;
        var self = this;
        self.socket.on(CallingEvents.ON_CALL, function (data) {
            console.log(CallingEvents.ON_CALL, JSON.stringify(data));
            self.rtcCallListener.onCall(data);
        });
    };
    ServerEventListener.prototype.addPushListener = function (obj) {
        this.pushServerListener = obj;
        var self = this;
        self.socket.on(PushEvents.ON_PUSH, function (data) {
            self.pushServerListener.onPush(data);
        });
    };
    // <!-- AccessRoom Info -->
    ServerEventListener.ON_ACCESS_ROOMS = "onAccessRooms";
    ServerEventListener.ON_ADD_ROOM_ACCESS = "onAddRoomAccess";
    ServerEventListener.ON_UPDATED_LASTACCESSTIME = "onUpdatedLastAccessTime";
    return ServerEventListener;
}());
export { ServerEventListener };
