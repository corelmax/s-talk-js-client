var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ChatRoomAPI {
    constructor(_server) {
        this.server = _server;
    }
    chat(target, _message, callback) {
        let socket = this.server.getSocket();
        socket.request("chat.chatHandler.send", _message, (result) => {
            if (callback !== null) {
                if (result instanceof Error) {
                    callback(result, null);
                }
                else {
                    callback(null, result);
                }
            }
        });
    }
    pushByUids(_message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, rejected) => {
                try {
                    let socket = this.server.getSocket();
                    socket.request("chat.chatHandler.pushByUids", _message, (result) => {
                        resolve(result);
                    });
                }
                catch (ex) {
                    rejected(ex);
                }
            });
        });
    }
    getSyncDateTime(callback) {
        let socket = this.server.getSocket();
        let message = {};
        socket.request("chat.chatHandler.getSyncDateTime", message, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    /**
     * get older message histories.
     */
    getOlderMessageChunk(roomId, topEdgeMessageTime, callback) {
        let socket = this.server.getSocket();
        let message = {};
        message["rid"] = roomId;
        message["topEdgeMessageTime"] = topEdgeMessageTime.toString();
        socket.request("chat.chatHandler.getOlderMessageChunk", message, (result) => {
            console.log("getOlderMessageChunk", result);
            if (callback !== null) {
                callback(null, result);
            }
        });
    }
    getMessagesReaders(topEdgeMessageTime) {
        let socket = this.server.getSocket();
        let message = {};
        message["topEdgeMessageTime"] = topEdgeMessageTime;
        socket.request("chat.chatHandler.getMessagesReaders", message, (result) => {
            console.info("getMessagesReaders respones: ", result);
        });
    }
    getMessageContent(messageId, callback) {
        let socket = this.server.getSocket();
        let message = {};
        message["messageId"] = messageId;
        socket.request("chat.chatHandler.getMessageContent", message, (result) => {
            if (!!callback) {
                callback(undefined, result);
            }
        });
    }
    updateMessageReader(messageId, roomId) {
        let socket = this.server.getSocket();
        let message = {};
        message["messageId"] = messageId;
        message["roomId"] = roomId;
        socket.notify("chat.chatHandler.updateWhoReadMessage", message);
    }
    updateMessageReaders(messageIds, roomId) {
        let socket = this.server.getSocket();
        let message = {};
        message["messageIds"] = JSON.stringify(messageIds);
        message["roomId"] = roomId;
        socket.notify("chat.chatHandler.updateWhoReadMessages", message);
    }
}
