/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
var chatRoomComponent_1 = require("../../chats/chatRoomComponent");
var BackendFactory_1 = require("../../chats/BackendFactory");
var secureServiceFactory_1 = require("../../libs/chitchat/services/secureServiceFactory");
var serverEventListener_1 = require("../../libs/stalk/serverEventListener");
var httpStatusCode_1 = require("../../libs/stalk/utils/httpStatusCode");
var ChatDataModels_1 = require("../../chats/models/ChatDataModels");
var notificationManager_1 = require("../../chats/notificationManager");
var configureStore_1 = require("../configureStore");
var config_1 = require("../../configs/config");
/**
 * ChatRoomActionsType
 */
var ChatRoomActionsType = (function () {
    function ChatRoomActionsType() {
    }
    return ChatRoomActionsType;
}());
ChatRoomActionsType.STOP = "STOP_CHATROOM_REDUCER";
ChatRoomActionsType.GET_PERSISTEND_MESSAGE_REQUEST = "GET_PERSISTEND_MESSAGE_REQUEST";
ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
ChatRoomActionsType.GET_PERSISTEND_MESSAGE_FAILURE = "GET_PERSISTEND_MESSAGE_FAILURE";
ChatRoomActionsType.GET_NEWER_MESSAGE_FAILURE = "GET_NEWER_MESSAGE_FAILURE";
ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS = "GET_NEWER_MESSAGE_SUCCESS";
ChatRoomActionsType.SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST";
ChatRoomActionsType.SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
ChatRoomActionsType.SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
ChatRoomActionsType.JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
ChatRoomActionsType.JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
ChatRoomActionsType.JOIN_ROOM_FAILURE = "JOIN_ROOM_FAILURE";
ChatRoomActionsType.REPLACE_MESSAGE = "REPLACE_MESSAGE";
ChatRoomActionsType.ON_NEW_MESSAGE = "ON_NEW_MESSAGE";
ChatRoomActionsType.ON_EARLY_MESSAGE_READY = "ON_EARLY_MESSAGE_READY";
ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS = "LOAD_EARLY_MESSAGE_SUCCESS";
ChatRoomActionsType.SELECT_CHAT_ROOM = "SELECT_CHAT_ROOM";
exports.ChatRoomActionsType = ChatRoomActionsType;
function stop() {
    return function (dispatch) { return { type: ChatRoomActionsType.STOP }; };
}
exports.stop = stop;
function initChatRoom(currentRoom) {
    return function (dispatch) {
        if (!currentRoom)
            throw new Error("Empty roomInfo");
        var chatroomComp = chatRoomComponent_1.default.getInstance();
        chatroomComp.setRoomId(currentRoom._id);
        BackendFactory_1.default.getInstance().dataListener.addChatListenerImp(chatroomComp);
        notificationManager_1.default.getInstance().unsubscribeGlobalNotifyMessageEvent();
        chatroomComp.chatroomDelegate = onChatRoomDelegate;
        chatroomComp.outsideRoomDelegete = onOutSideRoomDelegate;
    };
}
exports.initChatRoom = initChatRoom;
function onChatRoomDelegate(event, newMsg) {
    if (event == serverEventListener_1.default.ON_CHAT) {
        console.log("onChatRoomDelegate: ", serverEventListener_1.default.ON_CHAT, newMsg);
        /**
         * Todo **
         * - if message_id is mine. Replace message_id to local messages list.
         * - if not my message. Update who read this message. And tell anyone.
         */
        if (BackendFactory_1.default.getInstance().dataManager.isMySelf(newMsg.sender)) {
        }
        else {
            console.log("is contact message");
            //@ Check app not run in background.
            var device = configureStore_1.default.getState().deviceReducer;
            console.warn("AppState: ", device.appState); //active, background, inactive
            if (device.appState == "active") {
                BackendFactory_1.default.getInstance().getChatApi().updateMessageReader(newMsg._id, newMsg.rid);
            }
            else if (device.appState != "active") {
                //@ When user joined room but appState is inActive.
                // sharedObjectService.getNotifyManager().notify(newMsg, appBackground, localNotifyService);
                console.warn("Call local notification here...");
            }
            configureStore_1.default.dispatch(onNewMessage(newMsg));
        }
    }
    else if (event === serverEventListener_1.default.ON_MESSAGE_READ) {
        console.log("serviceListener: ", serverEventListener_1.default.ON_MESSAGE_READ, newMsg);
    }
}
function onOutSideRoomDelegate(event, data) {
    if (event === serverEventListener_1.default.ON_CHAT) {
        console.log("Call notification here..."); //active, background, inactive
        notificationManager_1.default.getInstance().notify(data);
    }
}
function replaceMyMessage(receiveMsg) {
    return {
        type: ChatRoomActionsType.REPLACE_MESSAGE,
        payload: receiveMsg
    };
}
function onNewMessage(messages) {
    return {
        type: ChatRoomActionsType.ON_NEW_MESSAGE,
        payload: messages
    };
}
function getPersistendMessage_request() {
    return {
        type: ChatRoomActionsType.GET_PERSISTEND_MESSAGE_REQUEST
    };
}
function getPersistendMessage_success(data) {
    return {
        type: ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS,
        payload: data
    };
}
function getPersistendMessage_failure() {
    return {
        type: ChatRoomActionsType.GET_PERSISTEND_MESSAGE_FAILURE
    };
}
function getPersistendMessage(currentRid) {
    return function (dispatch) {
        dispatch(getPersistendMessage_request());
        chatRoomComponent_1.default.getInstance().getPersistentMessage(currentRid, function (err, messages) {
            console.log("getPersistendMessage of room %s: completed.", currentRid, chatRoomComponent_1.default.getInstance().chatMessages.length);
            if (err) {
                dispatch(getPersistendMessage_failure());
            }
            else {
                dispatch(getPersistendMessage_success());
            }
        });
        //@ Next call 2 method below. -->
        //getNewerMessageFromNet();
        //checkOlderMessages();
    };
}
exports.getPersistendMessage = getPersistendMessage;
function onEarlyMessageReady(data) {
    return {
        type: ChatRoomActionsType.ON_EARLY_MESSAGE_READY,
        payload: data
    };
}
function checkOlderMessages() {
    return function (dispatch) {
        chatRoomComponent_1.default.getInstance().checkOlderMessages(function done(err, res) {
            if (!err && res.data > 0) {
                console.log('has olderMessage => %s', res.data);
                //               console.log("onOlderMessageReady is true ! Show load earlier message on top view.");
                dispatch(onEarlyMessageReady(true));
            }
            else {
                //                console.log("onOlderMessageReady is false ! Don't show load earlier message on top view.");
                dispatch(onEarlyMessageReady(false));
            }
        });
    };
}
exports.checkOlderMessages = checkOlderMessages;
function getNewerMessage_failure() {
    return { type: ChatRoomActionsType.GET_NEWER_MESSAGE_FAILURE };
}
function getNewerMessage_success() {
    return { type: ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS };
}
function getNewerMessageFromNet() {
    return function (dispatch) {
        chatRoomComponent_1.default.getInstance().getNewerMessageRecord(function done(err, result) {
            if (err) {
                dispatch(getNewerMessage_failure());
            }
            else {
                dispatch(getNewerMessage_success());
            }
            //@ Todo next joinroom function is ready to call.
        });
    };
}
exports.getNewerMessageFromNet = getNewerMessageFromNet;
function send_message_request() {
    return { type: ChatRoomActionsType.SEND_MESSAGE_REQUEST };
}
function send_message_success(data) {
    return {
        type: ChatRoomActionsType.SEND_MESSAGE_SUCCESS,
        payload: data
    };
}
function send_message_failure(data) {
    return {
        type: ChatRoomActionsType.SEND_MESSAGE_FAILURE,
        payload: data
    };
}
function sendMessage(message) {
    return function (dispatch) {
        var secure = secureServiceFactory_1.default.getService();
        var msg = {};
        msg.rid = message.rid;
        msg.content = message.text;
        msg.sender = message.sender;
        msg.target = message.target;
        msg.type = message.type;
        msg.uuid = message.uniqueId;
        dispatch(send_message_request());
        if (msg.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Location]) {
            msg.content = message.location;
            BackendFactory_1.default.getInstance().getChatApi().chat("*", msg, function (err, res) {
                dispatch(sendMessageResponse(err, res));
            });
            return;
        }
        if (config_1.default.appConfig.encryption == true) {
            secure.decryptWithSecureRandom(msg.content, function (err, result) {
                if (err) {
                    console.error(err);
                }
                else {
                    msg.content = result;
                    BackendFactory_1.default.getInstance().getChatApi().chat("*", msg, function (err, res) {
                        dispatch(sendMessageResponse(err, res));
                    });
                }
            });
        }
        else {
            BackendFactory_1.default.getInstance().getChatApi().chat("*", msg, function (err, res) {
                dispatch(sendMessageResponse(err, res));
            });
        }
    };
}
exports.sendMessage = sendMessage;
function sendFile(message) {
    return function (dispatch) {
        dispatch(send_message_request());
        var msg = {};
        msg.rid = message.rid;
        msg.sender = message.sender;
        msg.target = message.target;
        msg.type = message.type;
        msg.uuid = message.uniqueId;
        msg.content = message.image;
        BackendFactory_1.default.getInstance().getChatApi().chat("*", msg, function (err, res) {
            dispatch(sendMessageResponse(err, res));
        });
    };
}
exports.sendFile = sendFile;
function sendMessageResponse(err, res) {
    return function (dispatch) {
        if (!!err || res.code !== httpStatusCode_1.default.success) {
            console.warn("send message fail.", err, res);
            dispatch(send_message_failure(res.body));
        }
        else {
            console.log("sendMessageResponse", res);
            dispatch(send_message_success(res.data));
        }
    };
}
function joinRoom_request() {
    return { type: ChatRoomActionsType.JOIN_ROOM_REQUEST };
}
function joinRoom_success(data) {
    return { type: ChatRoomActionsType.JOIN_ROOM_SUCCESS, payload: data };
}
function joinRoom_failure() {
    return { type: ChatRoomActionsType.JOIN_ROOM_FAILURE };
}
function joinRoom(roomId, token, username) {
    return function (dispatch) {
        dispatch(joinRoom_request());
        BackendFactory_1.default.getInstance().getServer().then(function (server) {
            server.JoinChatRoomRequest(token, username, roomId, function (err, res) {
                if (err || res.code != httpStatusCode_1.default.success) {
                    dispatch(joinRoom_failure());
                }
                else {
                    dispatch(joinRoom_success());
                }
            });
        }).catch(function (err) {
            dispatch(joinRoom_failure());
        });
    };
}
exports.joinRoom = joinRoom;
function leaveRoom() {
    return function (dispatch) {
        var token = configureStore_1.default.getState().authReducer.token;
        var myProfile = configureStore_1.default.getState().profileReducer.form.profile;
        var username = myProfile.email;
        var room = chatRoomComponent_1.default.getInstance();
        BackendFactory_1.default.getInstance().getServer().then(function (server) {
            server.LeaveChatRoomRequest(token, room.getRoomId(), username, function (err, res) {
                console.log("leaveRoom result", res);
                BackendFactory_1.default.getInstance().dataListener.removeChatListenerImp(room);
                chatRoomComponent_1.default.getInstance().dispose();
                notificationManager_1.default.getInstance().regisNotifyNewMessageEvent();
            });
        }).catch(function (err) {
        });
    };
}
exports.leaveRoom = leaveRoom;
function loadEarlyMessage_success() {
    return {
        type: ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS
    };
}
function loadEarlyMessageChunk() {
    return function (dispatch) {
        chatRoomComponent_1.default.getInstance().getOlderMessageChunk(function done(err, res) {
            console.log('olderMessages %s => %s', res.length, chatRoomComponent_1.default.getInstance().chatMessages.length);
            dispatch(loadEarlyMessage_success());
            //@ check older message again.
            dispatch(checkOlderMessages());
        });
    };
}
exports.loadEarlyMessageChunk = loadEarlyMessageChunk;
function selectRoom(roomInfo) {
    return {
        type: ChatRoomActionsType.SELECT_CHAT_ROOM,
        payload: roomInfo
    };
}
exports.selectRoom = selectRoom;
