export default class ChatRoomApiProvider {
    constructor(socket) {
        this.pomelo = socket;
    }
    chat(target, _message, callback) {
        let msg = {};
        msg["rid"] = _message.rid;
        msg["content"] = _message.text;
        msg["sender"] = _message.sender;
        msg["target"] = target;
        msg["type"] = _message.type;
        msg["uuid"] = _message.uniqueId;
        this.pomelo.request("chat.chatHandler.send", msg, (result) => {
            var data = JSON.parse(JSON.stringify(result));
            if (callback !== null)
                callback(null, data);
        });
    }
    chatFile(room_id, target, sender_id, fileUrl, contentType, meta, callback) {
        console.log("Send file to ", target);
        var message = {};
        message["rid"] = room_id;
        message["content"] = fileUrl;
        message["sender"] = sender_id;
        message["target"] = target;
        message["meta"] = meta;
        message["type"] = contentType;
        this.pomelo.request("chat.chatHandler.send", message, (result) => {
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
    }
    getSyncDateTime(callback) {
        var message = {};
        this.pomelo.request("chat.chatHandler.getSyncDateTime", message, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    /**
     * getChatHistory function used for pull history chat record...
     * Beware!!! please call before JoinChatRoom.
     * @param room_id
     * @param lastAccessTime
     * @param callback
     */
    getChatHistory(room_id, lastAccessTime, callback) {
        var message = {};
        message["rid"] = room_id;
        if (lastAccessTime != null) {
            //<!-- Only first communication is has a problem.
            message["lastAccessTime"] = lastAccessTime.toString();
        }
        this.pomelo.request("chat.chatHandler.getChatHistory", message, (result) => {
            if (callback !== null)
                callback(null, result);
        });
    }
    /**
     * get older message histories.
     */
    getOlderMessageChunk(roomId, topEdgeMessageTime, callback) {
        var message = {};
        message["rid"] = roomId;
        message["topEdgeMessageTime"] = topEdgeMessageTime.toString();
        this.pomelo.request("chat.chatHandler.getOlderMessageChunk", message, (result) => {
            if (callback !== null)
                callback(null, result);
        });
    }
    checkOlderMessagesCount(roomId, topEdgeMessageTime, callback) {
        let message = {};
        message["rid"] = roomId;
        message["topEdgeMessageTime"] = topEdgeMessageTime.toString();
        this.pomelo.request("chat.chatHandler.checkOlderMessagesCount", message, (result) => {
            if (callback !== null)
                callback(null, result);
        });
    }
    getMessagesReaders(topEdgeMessageTime) {
        var message = {};
        message["topEdgeMessageTime"] = topEdgeMessageTime;
        this.pomelo.request("chat.chatHandler.getMessagesReaders", message, (result) => {
            console.info('getMessagesReaders respones: ', result);
        });
    }
    getMessageContent(messageId, callback) {
        var message = {};
        message["messageId"] = messageId;
        this.pomelo.request("chat.chatHandler.getMessageContent", message, (result) => {
            if (!!callback) {
                callback(null, result);
            }
        });
    }
    updateMessageReader(messageId, roomId) {
        var message = {};
        message["messageId"] = messageId;
        message["roomId"] = roomId;
        this.pomelo.notify("chat.chatHandler.updateWhoReadMessage", message);
    }
    updateMessageReaders(messageIds, roomId) {
        var message = {};
        message["messageIds"] = JSON.stringify(messageIds);
        message["roomId"] = roomId;
        this.pomelo.notify("chat.chatHandler.updateWhoReadMessages", message);
    }
}
