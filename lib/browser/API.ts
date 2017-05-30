import { IDictionary, Stalk, IPomelo } from "./serverImplemented";
import { HttpStatusCode } from '../utils/httpStatusCode';

export namespace API {
    export class LobbyAPI {
        private server: Stalk.ServerImplemented;
        private socket: IPomelo;
        constructor(_server: Stalk.ServerImplemented) {
            this.server = _server;
            this.socket = _server.getSocket();
        }

        public checkIn(msg: IDictionary) {
            let self = this;
            let socket = this.server.getSocket();

            return new Promise((resolve, rejected) => {
                // <!-- Authentication.
                socket.request("connector.entryHandler.login", msg, function (res) {
                    if (res.code === HttpStatusCode.fail) {
                        rejected(res.message);
                    }
                    else if (res.code === HttpStatusCode.success) {
                        resolve(res);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        }

        public logout() {
            let registrationId = "";
            let msg = {} as IDictionary;
            msg["username"] = null;
            msg["registrationId"] = registrationId;
            if (this.socket != null) {
                this.socket.notify("connector.entryHandler.logout", msg);
            }

            this.server.disConnect();
            this.server = null;
        }

        // <!-- Join and leave chat room.
        public joinRoom(token: string, username, room_id: string, callback: (err, res) => void) {
            let self = this;
            let msg = {} as IDictionary;
            msg["token"] = token;
            msg["rid"] = room_id;
            msg["username"] = username;
            self.socket.request("connector.entryHandler.enterRoom", msg, (result) => {
                if (callback !== null) {
                    callback(null, result);
                }
            });
        }
        public leaveRoom(token: string, roomId: string, callback: (err, res) => void) {
            let self = this;
            let msg = {} as IDictionary;
            msg["token"] = token;
            msg["rid"] = roomId;
            self.socket.request("connector.entryHandler.leaveRoom", msg, (result) => {
                if (callback != null)
                    callback(null, result);
            });
        }
    }

    export class ChatRoomAPI {
        private server: Stalk.ServerImplemented;
        private socket: IPomelo;
        constructor(_server: Stalk.ServerImplemented) {
            this.server = _server;
            this.socket = _server.getSocket();
        }

        public chat(target: string, _message: IDictionary, callback: (err, res) => void) {
            this.socket.request("chat.chatHandler.send", _message, (result) => {
                if (callback !== null) {
                    if (result instanceof Error)
                        callback(result, null);
                    else
                        callback(null, result);
                }
            });
        }

        public getSyncDateTime(callback: (err, res) => void) {
            let message = {} as IDictionary;
            this.socket.request("chat.chatHandler.getSyncDateTime", message, (result) => {
                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        /**
         * get older message histories.
         */
        public getOlderMessageChunk(roomId: string, topEdgeMessageTime: Date, callback: (err, res) => void) {
            let message = {} as IDictionary;
            message["rid"] = roomId;
            message["topEdgeMessageTime"] = topEdgeMessageTime.toString();

            this.socket.request("chat.chatHandler.getOlderMessageChunk", message, (result) => {
                console.log("getOlderMessageChunk", result);
                if (callback !== null)
                    callback(null, result);
            });
        }

        public getMessagesReaders(topEdgeMessageTime: string) {
            let message = {} as IDictionary;
            message["topEdgeMessageTime"] = topEdgeMessageTime;
            this.socket.request("chat.chatHandler.getMessagesReaders", message, (result) => {
                console.info("getMessagesReaders respones: ", result);
            });
        }

        public getMessageContent(messageId: string, callback: (err: Error, res: any) => void) {
            let message = {} as IDictionary;
            message["messageId"] = messageId;
            this.socket.request("chat.chatHandler.getMessageContent", message, (result) => {
                if (!!callback) {
                    callback(null, result);
                }
            });
        }

        public updateMessageReader(messageId: string, roomId: string) {
            let message = {} as IDictionary;
            message["messageId"] = messageId;
            message["roomId"] = roomId;
            this.socket.notify("chat.chatHandler.updateWhoReadMessage", message);
        }

        public updateMessageReaders(messageIds: string[], roomId: string) {
            let message = {} as IDictionary;
            message["messageIds"] = JSON.stringify(messageIds);
            message["roomId"] = roomId;
            this.socket.notify("chat.chatHandler.updateWhoReadMessages", message);
        }
    }
}