"use strict";
class ChatRoomApiProvider {
    constructor(socket) {
        this.pomelo = socket;
    }
    chat(target, _message, callback) {
        this.pomelo.request("chat.chatHandler.send", _message, (result) => {
            if (callback !== null) {
                if (result instanceof Error)
                    callback(result, null);
                else
                    callback(null, result);
            }
        });
    }
    /**
     * @deprecated please use chat instead.
     */
    chatFile(room_id, target, sender_id, fileUrl, contentType, meta, callback) {
        console.log("Send file to ", target);
        let message = {};
        message["rid"] = room_id;
        message["content"] = fileUrl;
        message["sender"] = sender_id;
        message["target"] = target;
        message["meta"] = meta;
        message["type"] = contentType;
        this.pomelo.request("chat.chatHandler.send", message, (result) => {
            let data = JSON.parse(JSON.stringify(result));
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
    }
    getSyncDateTime(callback) {
        let message = {};
        this.pomelo.request("chat.chatHandler.getSyncDateTime", message, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    /**
     * get older message histories.
     */
    getOlderMessageChunk(roomId, topEdgeMessageTime, callback) {
        let message = {};
        message["rid"] = roomId;
        message["topEdgeMessageTime"] = topEdgeMessageTime.toString();
        this.pomelo.request("chat.chatHandler.getOlderMessageChunk", message, (result) => {
            console.log("getOlderMessageChunk", result);
            if (callback !== null)
                callback(null, result);
        });
    }
    getMessagesReaders(topEdgeMessageTime) {
        let message = {};
        message["topEdgeMessageTime"] = topEdgeMessageTime;
        this.pomelo.request("chat.chatHandler.getMessagesReaders", message, (result) => {
            console.info("getMessagesReaders respones: ", result);
        });
    }
    getMessageContent(messageId, callback) {
        let message = {};
        message["messageId"] = messageId;
        this.pomelo.request("chat.chatHandler.getMessageContent", message, (result) => {
            if (!!callback) {
                callback(null, result);
            }
        });
    }
    updateMessageReader(messageId, roomId) {
        let message = {};
        message["messageId"] = messageId;
        message["roomId"] = roomId;
        this.pomelo.notify("chat.chatHandler.updateWhoReadMessage", message);
    }
    updateMessageReaders(messageIds, roomId) {
        let message = {};
        message["messageIds"] = JSON.stringify(messageIds);
        message["roomId"] = roomId;
        this.pomelo.notify("chat.chatHandler.updateWhoReadMessages", message);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatRoomApiProvider;
