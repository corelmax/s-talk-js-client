/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import ChatRoomComponent from "../../chats/chatRoomComponent";
import BackendFactory from "../../chats/BackendFactory";
import SecureServiceFactory from "../../libs/chitchat/services/secureServiceFactory";
import ServerEventListener from "../../libs/stalk/serverEventListener";
import HTTPStatus from "../../libs/stalk/utils/httpStatusCode";
import { ContentType } from "../../chats/models/ChatDataModels";
import NotificationManager from '../../chats/notificationManager';
import Store from "../configureStore";
import Config from "../../configs/config";
/**
 * ChatRoomActionsType
 */
export class ChatRoomActionsType {
}
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
export function stop() {
    return dispatch => { return { type: ChatRoomActionsType.STOP }; };
}
export function initChatRoom(currentRoom) {
    return dispatch => {
        if (!currentRoom)
            throw new Error("Empty roomInfo");
        let chatroomComp = ChatRoomComponent.getInstance();
        chatroomComp.setRoomId(currentRoom._id);
        BackendFactory.getInstance().dataListener.addChatListenerImp(chatroomComp);
        NotificationManager.getInstance().unsubscribeGlobalNotifyMessageEvent();
        chatroomComp.chatroomDelegate = onChatRoomDelegate;
        chatroomComp.outsideRoomDelegete = onOutSideRoomDelegate;
    };
}
function onChatRoomDelegate(event, newMsg) {
    if (event == ServerEventListener.ON_CHAT) {
        console.log("onChatRoomDelegate: ", ServerEventListener.ON_CHAT, newMsg);
        /**
         * Todo **
         * - if message_id is mine. Replace message_id to local messages list.
         * - if not my message. Update who read this message. And tell anyone.
         */
        if (BackendFactory.getInstance().dataManager.isMySelf(newMsg.sender)) {
        }
        else {
            console.log("is contact message");
            //@ Check app not run in background.
            let device = Store.getState().deviceReducer;
            console.warn("AppState: ", device.appState); //active, background, inactive
            if (device.appState == "active") {
                BackendFactory.getInstance().getChatApi().updateMessageReader(newMsg._id, newMsg.rid);
            }
            else if (device.appState != "active") {
                //@ When user joined room but appState is inActive.
                // sharedObjectService.getNotifyManager().notify(newMsg, appBackground, localNotifyService);
                console.warn("Call local notification here...");
            }
            Store.dispatch(onNewMessage(newMsg));
        }
    }
    else if (event === ServerEventListener.ON_MESSAGE_READ) {
        console.log("serviceListener: ", ServerEventListener.ON_MESSAGE_READ, newMsg);
    }
}
function onOutSideRoomDelegate(event, data) {
    if (event === ServerEventListener.ON_CHAT) {
        console.log("Call notification here..."); //active, background, inactive
        NotificationManager.getInstance().notify(data);
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
export function getPersistendMessage(currentRid) {
    return (dispatch) => {
        dispatch(getPersistendMessage_request());
        ChatRoomComponent.getInstance().getPersistentMessage(currentRid, function (err, messages) {
            console.log("getPersistendMessage of room %s: completed.", currentRid, ChatRoomComponent.getInstance().chatMessages.length);
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
function onEarlyMessageReady(data) {
    return {
        type: ChatRoomActionsType.ON_EARLY_MESSAGE_READY,
        payload: data
    };
}
export function checkOlderMessages() {
    return dispatch => {
        ChatRoomComponent.getInstance().checkOlderMessages(function done(err, res) {
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
function getNewerMessage_failure() {
    return { type: ChatRoomActionsType.GET_NEWER_MESSAGE_FAILURE };
}
function getNewerMessage_success() {
    return { type: ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS };
}
export function getNewerMessageFromNet() {
    return dispatch => {
        ChatRoomComponent.getInstance().getNewerMessageRecord(function done(err, result) {
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
export function sendMessage(message) {
    return (dispatch) => {
        let secure = SecureServiceFactory.getService();
        let msg = {};
        msg.rid = message.rid;
        msg.content = message.text;
        msg.sender = message.sender;
        msg.target = message.target;
        msg.type = message.type;
        msg.uuid = message.uniqueId;
        dispatch(send_message_request());
        if (msg.type == ContentType[ContentType.Location]) {
            msg.content = message.location;
            BackendFactory.getInstance().getChatApi().chat("*", msg, (err, res) => {
                dispatch(sendMessageResponse(err, res));
            });
            return;
        }
        if (Config.appConfig.encryption == true) {
            secure.decryptWithSecureRandom(msg.content, function (err, result) {
                if (err) {
                    console.error(err);
                }
                else {
                    msg.content = result;
                    BackendFactory.getInstance().getChatApi().chat("*", msg, (err, res) => {
                        dispatch(sendMessageResponse(err, res));
                    });
                }
            });
        }
        else {
            BackendFactory.getInstance().getChatApi().chat("*", msg, (err, res) => {
                dispatch(sendMessageResponse(err, res));
            });
        }
    };
}
export function sendFile(message) {
    return (dispatch) => {
        dispatch(send_message_request());
        let msg = {};
        msg.rid = message.rid;
        msg.sender = message.sender;
        msg.target = message.target;
        msg.type = message.type;
        msg.uuid = message.uniqueId;
        msg.content = message.image;
        BackendFactory.getInstance().getChatApi().chat("*", msg, (err, res) => {
            dispatch(sendMessageResponse(err, res));
        });
    };
}
function sendMessageResponse(err, res) {
    return dispatch => {
        if (!!err || res.code !== HTTPStatus.success) {
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
export function joinRoom(roomId, token, username) {
    return (dispatch) => {
        dispatch(joinRoom_request());
        BackendFactory.getInstance().getServer().then(server => {
            server.JoinChatRoomRequest(token, username, roomId, (err, res) => {
                if (err || res.code != HTTPStatus.success) {
                    dispatch(joinRoom_failure());
                }
                else {
                    dispatch(joinRoom_success());
                }
            });
        }).catch(err => {
            dispatch(joinRoom_failure());
        });
    };
}
export function leaveRoom() {
    return (dispatch) => {
        let token = Store.getState().authReducer.token;
        let myProfile = Store.getState().profileReducer.form.profile;
        let username = myProfile.email;
        let room = ChatRoomComponent.getInstance();
        BackendFactory.getInstance().getServer().then(server => {
            server.LeaveChatRoomRequest(token, room.getRoomId(), username, (err, res) => {
                console.log("leaveRoom result", res);
                BackendFactory.getInstance().dataListener.removeChatListenerImp(room);
                ChatRoomComponent.getInstance().dispose();
                NotificationManager.getInstance().regisNotifyNewMessageEvent();
            });
        }).catch(err => {
        });
    };
}
function loadEarlyMessage_success() {
    return {
        type: ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS
    };
}
export function loadEarlyMessageChunk() {
    return dispatch => {
        ChatRoomComponent.getInstance().getOlderMessageChunk(function done(err, res) {
            console.log('olderMessages %s => %s', res.length, ChatRoomComponent.getInstance().chatMessages.length);
            dispatch(loadEarlyMessage_success());
            //@ check older message again.
            dispatch(checkOlderMessages());
        });
    };
}
export function selectRoom(roomInfo) {
    return {
        type: ChatRoomActionsType.SELECT_CHAT_ROOM,
        payload: roomInfo
    };
}
