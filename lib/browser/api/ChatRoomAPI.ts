import { ServerImp, IDictionary } from "../ServerImplement";

export class ChatRoomAPI {
    private server: ServerImp;

    constructor(_server: ServerImp) {
        this.server = _server;
    }

    public chat(target: string, _message: any, callback: (err, res) => void) {
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

    public async pushByUids(_message: IDictionary) {
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
    }

    public getSyncDateTime(callback: (err, res) => void) {
        let socket = this.server.getSocket();
        let message = {} as IDictionary;
        socket.request("chat.chatHandler.getSyncDateTime", message, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }

    /**
     * get older message histories.
     */
    public getOlderMessageChunk(roomId: string, topEdgeMessageTime: Date, callback: (err, res) => void) {
        let socket = this.server.getSocket();
        let message = {} as IDictionary;
        message["rid"] = roomId;
        message["topEdgeMessageTime"] = topEdgeMessageTime.toString();

        socket.request("chat.chatHandler.getOlderMessageChunk", message, (result) => {
            console.log("getOlderMessageChunk", result);
            if (callback !== null) {
                callback(null, result);
            }
        });
    }

    public getMessagesReaders(topEdgeMessageTime: string) {
        let socket = this.server.getSocket();
        let message = {} as IDictionary;
        message["topEdgeMessageTime"] = topEdgeMessageTime;
        socket.request("chat.chatHandler.getMessagesReaders", message, (result) => {
            console.info("getMessagesReaders respones: ", result);
        });
    }

    public getMessageContent(messageId: string, callback: (err: Error | undefined, res: any) => void) {
        let socket = this.server.getSocket();
        let message = {} as IDictionary;
        message["messageId"] = messageId;
        socket.request("chat.chatHandler.getMessageContent", message, (result) => {
            if (!!callback) {
                callback(undefined, result);
            }
        });
    }

    public updateMessageReader(messageId: string, roomId: string) {
        let socket = this.server.getSocket();
        let message = {} as IDictionary;
        message["messageId"] = messageId;
        message["roomId"] = roomId;
        socket.notify("chat.chatHandler.updateWhoReadMessage", message);
    }

    public updateMessageReaders(messageIds: string[], roomId: string) {
        let socket = this.server.getSocket();
        let message = {} as IDictionary;
        message["messageIds"] = JSON.stringify(messageIds);
        message["roomId"] = roomId;
        socket.notify("chat.chatHandler.updateWhoReadMessages", message);
    }
}