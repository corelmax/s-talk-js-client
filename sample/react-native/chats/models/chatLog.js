"use strict";
var ChatLog = (function () {
    function ChatLog(room) {
        this.id = room._id;
        this.roomName = room.name;
        this.roomType = room.type;
        this.room = room;
    }
    ChatLog.prototype.setNotiCount = function (count) {
        this.count = count;
    };
    ChatLog.prototype.setLastMessage = function (lastMessage) {
        this.lastMessage = lastMessage;
    };
    ChatLog.prototype.setLastMessageTime = function (lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    };
    return ChatLog;
}());
exports.__esModule = true;
exports["default"] = ChatLog;
