"use strict";
var httpStatusCode_1 = require("../utils/httpStatusCode");
var API;
(function (API) {
    var LobbyAPI = (function () {
        function LobbyAPI(_server) {
            this.server = _server;
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
            var socket = this.server.getSocket();
            if (socket != null) {
                socket.notify("connector.entryHandler.logout", msg);
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
            var socket = this.server.getSocket();
            socket.request("connector.entryHandler.enterRoom", msg, function (result) {
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
            var socket = this.server.getSocket();
            socket.request("connector.entryHandler.leaveRoom", msg, function (result) {
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
        }
        ChatRoomAPI.prototype.chat = function (target, _message, callback) {
            var socket = this.server.getSocket();
            socket.request("chat.chatHandler.send", _message, function (result) {
                if (callback !== null) {
                    if (result instanceof Error)
                        callback(result, null);
                    else
                        callback(null, result);
                }
            });
        };
        ChatRoomAPI.prototype.getSyncDateTime = function (callback) {
            var socket = this.server.getSocket();
            var message = {};
            socket.request("chat.chatHandler.getSyncDateTime", message, function (result) {
                if (callback != null) {
                    callback(null, result);
                }
            });
        };
        /**
         * get older message histories.
         */
        ChatRoomAPI.prototype.getOlderMessageChunk = function (roomId, topEdgeMessageTime, callback) {
            var socket = this.server.getSocket();
            var message = {};
            message["rid"] = roomId;
            message["topEdgeMessageTime"] = topEdgeMessageTime.toString();
            socket.request("chat.chatHandler.getOlderMessageChunk", message, function (result) {
                console.log("getOlderMessageChunk", result);
                if (callback !== null)
                    callback(null, result);
            });
        };
        ChatRoomAPI.prototype.getMessagesReaders = function (topEdgeMessageTime) {
            var socket = this.server.getSocket();
            var message = {};
            message["topEdgeMessageTime"] = topEdgeMessageTime;
            socket.request("chat.chatHandler.getMessagesReaders", message, function (result) {
                console.info("getMessagesReaders respones: ", result);
            });
        };
        ChatRoomAPI.prototype.getMessageContent = function (messageId, callback) {
            var socket = this.server.getSocket();
            var message = {};
            message["messageId"] = messageId;
            socket.request("chat.chatHandler.getMessageContent", message, function (result) {
                if (!!callback) {
                    callback(null, result);
                }
            });
        };
        ChatRoomAPI.prototype.updateMessageReader = function (messageId, roomId) {
            var socket = this.server.getSocket();
            var message = {};
            message["messageId"] = messageId;
            message["roomId"] = roomId;
            socket.notify("chat.chatHandler.updateWhoReadMessage", message);
        };
        ChatRoomAPI.prototype.updateMessageReaders = function (messageIds, roomId) {
            var socket = this.server.getSocket();
            var message = {};
            message["messageIds"] = JSON.stringify(messageIds);
            message["roomId"] = roomId;
            socket.notify("chat.chatHandler.updateWhoReadMessages", message);
        };
        return ChatRoomAPI;
    }());
    API.ChatRoomAPI = ChatRoomAPI;
})(API = exports.API || (exports.API = {}));
