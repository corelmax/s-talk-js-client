"use strict";
var httpStatusCode_1 = require("../utils/httpStatusCode");
var API;
(function (API) {
    var LobbyAPI = (function () {
        function LobbyAPI(_server) {
            this.server = _server;
            this.socket = _server.getSocket();
        }
        LobbyAPI.prototype.checkIn = function (msg) {
            var self = this;
            var socket = this.server.getSocket();
            return new Promise(function (resolve, rejected) {
                // <!-- Authentication.
                socket.request("connector.entryHandler.login", msg, function (res) {
                    if (res.code === httpStatusCode_1.HttpStatusCode.fail) {
                        rejected(res.message);
                    }
                    else if (res.code === httpStatusCode_1.HttpStatusCode.success) {
                        resolve(res);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        };
        LobbyAPI.prototype.logout = function () {
            var registrationId = "";
            var msg = {};
            msg["username"] = null;
            msg["registrationId"] = registrationId;
            if (this.socket != null) {
                this.socket.notify("connector.entryHandler.logout", msg);
            }
            this.server.disConnect();
            this.server = null;
        };
        // <!-- Join and leave chat room.
        LobbyAPI.prototype.joinRoom = function (token, username, room_id, callback) {
            var self = this;
            var msg = {};
            msg["token"] = token;
            msg["rid"] = room_id;
            msg["username"] = username;
            self.socket.request("connector.entryHandler.enterRoom", msg, function (result) {
                if (callback !== null) {
                    callback(null, result);
                }
            });
        };
        LobbyAPI.prototype.leaveRoom = function (token, roomId, callback) {
            var self = this;
            var msg = {};
            msg["token"] = token;
            msg["rid"] = roomId;
            self.socket.request("connector.entryHandler.leaveRoom", msg, function (result) {
                if (callback != null)
                    callback(null, result);
            });
        };
        return LobbyAPI;
    }());
    API.LobbyAPI = LobbyAPI;
    var ChatRoomAPI = (function () {
        function ChatRoomAPI(_server) {
            this.server = _server;
            this.socket = _server.getSocket();
        }
        ChatRoomAPI.prototype.chat = function (target, _message, callback) {
            this.socket.request("chat.chatHandler.send", _message, function (result) {
                if (callback !== null) {
                    if (result instanceof Error)
                        callback(result, null);
                    else
                        callback(null, result);
                }
            });
        };
        ChatRoomAPI.prototype.getSyncDateTime = function (callback) {
            var message = {};
            this.socket.request("chat.chatHandler.getSyncDateTime", message, function (result) {
                if (callback != null) {
                    callback(null, result);
                }
            });
        };
        /**
         * get older message histories.
         */
        ChatRoomAPI.prototype.getOlderMessageChunk = function (roomId, topEdgeMessageTime, callback) {
            var message = {};
            message["rid"] = roomId;
            message["topEdgeMessageTime"] = topEdgeMessageTime.toString();
            this.socket.request("chat.chatHandler.getOlderMessageChunk", message, function (result) {
                console.log("getOlderMessageChunk", result);
                if (callback !== null)
                    callback(null, result);
            });
        };
        ChatRoomAPI.prototype.getMessagesReaders = function (topEdgeMessageTime) {
            var message = {};
            message["topEdgeMessageTime"] = topEdgeMessageTime;
            this.socket.request("chat.chatHandler.getMessagesReaders", message, function (result) {
                console.info("getMessagesReaders respones: ", result);
            });
        };
        ChatRoomAPI.prototype.getMessageContent = function (messageId, callback) {
            var message = {};
            message["messageId"] = messageId;
            this.socket.request("chat.chatHandler.getMessageContent", message, function (result) {
                if (!!callback) {
                    callback(null, result);
                }
            });
        };
        ChatRoomAPI.prototype.updateMessageReader = function (messageId, roomId) {
            var message = {};
            message["messageId"] = messageId;
            message["roomId"] = roomId;
            this.socket.notify("chat.chatHandler.updateWhoReadMessage", message);
        };
        ChatRoomAPI.prototype.updateMessageReaders = function (messageIds, roomId) {
            var message = {};
            message["messageIds"] = JSON.stringify(messageIds);
            message["roomId"] = roomId;
            this.socket.notify("chat.chatHandler.updateWhoReadMessages", message);
        };
        return ChatRoomAPI;
    }());
    API.ChatRoomAPI = ChatRoomAPI;
})(API = exports.API || (exports.API = {}));
