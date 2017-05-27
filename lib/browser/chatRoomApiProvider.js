"use strict";
var ChatRoomApiProvider = (function () {
    function ChatRoomApiProvider(socket) {
        this.pomelo = socket;
    }
    ChatRoomApiProvider.prototype.chat = function (target, _message, callback) {
        this.pomelo.request("chat.chatHandler.send", _message, function (result) {
            if (callback !== null) {
                if (result instanceof Error)
                    callback(result, null);
                else
                    callback(null, result);
            }
        });
    };
    /**
     * @deprecated please use chat instead.
     */
    ChatRoomApiProvider.prototype.chatFile = function (room_id, target, sender_id, fileUrl, contentType, meta, callback) {
        console.log("Send file to ", target);
        var message = {};
        message["rid"] = room_id;
        message["content"] = fileUrl;
        message["sender"] = sender_id;
        message["target"] = target;
        message["meta"] = meta;
        message["type"] = contentType;
        this.pomelo.request("chat.chatHandler.send", message, function (result) {
            var data = JSON.parse(JSON.stringify(result));
            console.log("chatFile callback: ", data);
            if (data.code == 200) {
                if (callback != null) {
                    callback(null, data.data);
                }
            }
            else {
                console.error("WTF", "WTF god only know.");
            }
        });
    };
    ChatRoomApiProvider.prototype.getSyncDateTime = function (callback) {
        var message = {};
        this.pomelo.request("chat.chatHandler.getSyncDateTime", message, function (result) {
            if (callback != null) {
                callback(null, result);
            }
        });
    };
    /**
     * get older message histories.
     */
    ChatRoomApiProvider.prototype.getOlderMessageChunk = function (roomId, topEdgeMessageTime, callback) {
        var message = {};
        message["rid"] = roomId;
        message["topEdgeMessageTime"] = topEdgeMessageTime.toString();
        this.pomelo.request("chat.chatHandler.getOlderMessageChunk", message, function (result) {
            console.log("getOlderMessageChunk", result);
            if (callback !== null)
                callback(null, result);
        });
    };
    ChatRoomApiProvider.prototype.getMessagesReaders = function (topEdgeMessageTime) {
        var message = {};
        message["topEdgeMessageTime"] = topEdgeMessageTime;
        this.pomelo.request("chat.chatHandler.getMessagesReaders", message, function (result) {
            console.info("getMessagesReaders respones: ", result);
        });
    };
    ChatRoomApiProvider.prototype.getMessageContent = function (messageId, callback) {
        var message = {};
        message["messageId"] = messageId;
        this.pomelo.request("chat.chatHandler.getMessageContent", message, function (result) {
            if (!!callback) {
                callback(null, result);
            }
        });
    };
    ChatRoomApiProvider.prototype.updateMessageReader = function (messageId, roomId) {
        var message = {};
        message["messageId"] = messageId;
        message["roomId"] = roomId;
        this.pomelo.notify("chat.chatHandler.updateWhoReadMessage", message);
    };
    ChatRoomApiProvider.prototype.updateMessageReaders = function (messageIds, roomId) {
        var message = {};
        message["messageIds"] = JSON.stringify(messageIds);
        message["roomId"] = roomId;
        this.pomelo.notify("chat.chatHandler.updateWhoReadMessages", message);
    };
    return ChatRoomApiProvider;
}());
exports.ChatRoomApiProvider = ChatRoomApiProvider;
