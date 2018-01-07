"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const stalk_js_1 = require("stalk-js");
const starter_1 = require("stalk-js/starter");
const simpleChat_1 = require("stalk-js/starter/simpleChat");
const models_1 = require("stalk-js/starter/models");
const models_2 = require("stalk-js/starter/simpleChat/models");
const R = require("ramda");
const redux_actions_1 = require("redux-actions");
const chatroomService = require("../../services/chatroomService");
const MessageService = require("../../services/MessageService");
const NotificationManager = require("../stalkBridge/stalkNotificationActions");
const chatlogRxActions_1 = require("../chatlogs/chatlogRxActions");
const chatroomRxEpic_1 = require("./chatroomRxEpic");
const ChitChatFactory_1 = require("../../ChitChatFactory");
const Chitchat_1 = require("../../../../Chitchat");
const getStore = () => ChitChatFactory_1.ChitChatFactory.getInstance().store;
const getConfig = () => ChitChatFactory_1.ChitChatFactory.getInstance().config;
const authReducer = () => ChitChatFactory_1.ChitChatFactory.getInstance().authStore;
const appReducer = () => ChitChatFactory_1.ChitChatFactory.getInstance().appStore;
/**
 * ChatRoomActionsType
 */
exports.REPLACE_MESSAGE = "REPLACE_MESSAGE";
exports.ON_EARLY_MESSAGE_READY = "ON_EARLY_MESSAGE_READY";
function initChatRoom(currentRoom) {
    if (!currentRoom) {
        throw new Error("Empty roomInfo");
    }
    let room_name = currentRoom.owner;
    if (!room_name && currentRoom.type === models_2.RoomType.privateChat) {
        currentRoom.members.some((v, id, arr) => {
            if (v._id !== authReducer().user.id) {
                currentRoom.owner.username = v.username;
                return true;
            }
        });
    }
    let chatroomComp = simpleChat_1.ChatRoomComponent.createInstance();
    chatroomComp.setRoomId(currentRoom._id);
    NotificationManager.unsubscribeGlobalNotifyMessageEvent();
    chatroomComp.chatroomDelegate = onChatRoomDelegate;
    chatroomComp.outsideRoomDelegete = onOutSideRoomDelegate;
}
exports.initChatRoom = initChatRoom;
function onChatRoomDelegate(event, data) {
    if (event === stalk_js_1.ChatEvents.ON_CHAT) {
        console.log("onChatRoomDelegate: ", stalk_js_1.ChatEvents.ON_CHAT, data);
        let messageImp = data;
        /**
         * Todo **
         * - if message_id is mine. Replace message_id to local messages list.
         * - if not my message. Update who read this message. And tell anyone.
         */
        if (authReducer().user.userid === messageImp.sender) {
            // dispatch(replaceMyMessage(newMsg));
            console.log("is my message");
        }
        else {
            console.log("is contact message");
            // @ Check app not run in background.
            let appState = appReducer().appState;
            console.log("AppState: ", appState); // active, background, inactive
            if (!!appState) {
                if (appState === "active") {
                    MessageService.updateMessageReader(messageImp._id, messageImp.rid).then(response => response.json()).then(value => {
                        console.log("updateMessageReader: ", value);
                    }).catch(err => {
                        console.warn("updateMessageReader: ", err);
                    });
                }
                else if (appState !== "active") {
                    // @ When user joined room but appState is inActive.
                    // sharedObjectService.getNotifyManager().notify(newMsg, appBackground, localNotifyService);
                    console.warn("Call local notification here...");
                }
            }
        }
    }
    else if (event === simpleChat_1.ON_MESSAGE_CHANGE) {
        getStore().dispatch(onMessageChangedAction(data));
    }
}
function onOutSideRoomDelegate(event, data) {
    console.log("Call notification here..."); // active, background, inactive
    if (event === stalk_js_1.ChatEvents.ON_CHAT) {
        NotificationManager.notify(data);
    }
}
exports.ON_MESSAGE_CHANGED = "ON_MESSAGE_CHANGED";
const onMessageChangedAction = redux_actions_1.createAction(exports.ON_MESSAGE_CHANGED, (messages) => messages);
const onEarlyMessageReady = (data) => ({ type: exports.ON_EARLY_MESSAGE_READY, payload: data });
function checkOlderMessages() {
    return dispatch => {
        let room = getStore().getState().chatroomReducer.room;
        simpleChat_1.ChatRoomComponent.getInstance().getTopEdgeMessageTime().then(res => {
            chatroomService.getOlderMessagesCount(room._id, res.toString(), false)
                .then(response => response.json())
                .then((result) => {
                console.log("getOlderMessagesCount", result);
                if (result.success && result.result > 0) {
                    //               console.log("onOlderMessageReady is true ! Show load earlier message on top view.");
                    dispatch(onEarlyMessageReady(true));
                }
                else {
                    //                console.log("onOlderMessageReady is false ! Don't show load earlier message on top view.");
                    dispatch(onEarlyMessageReady(false));
                }
            }).catch(err => {
                console.warn("getOlderMessagesCount fail", err);
                dispatch(onEarlyMessageReady(false));
            });
        });
    };
}
exports.checkOlderMessages = checkOlderMessages;
exports.LOAD_EARLY_MESSAGE_SUCCESS = "LOAD_EARLY_MESSAGE_SUCCESS";
const loadEarlyMessage_success = (payload) => ({ type: exports.LOAD_EARLY_MESSAGE_SUCCESS, payload });
function loadEarlyMessageChunk(room_id) {
    return dispatch => {
        simpleChat_1.ChatRoomComponent.getInstance().getOlderMessageChunk(room_id).then(docs => {
            dispatch(loadEarlyMessage_success(docs));
            // @check older message again.
            dispatch(checkOlderMessages());
            //# update messages read.
            if (docs.length > 0) {
                dispatch(chatroomRxEpic_1.updateMessagesRead(docs, room_id));
            }
        }).catch(err => {
            console.warn("loadEarlyMessageChunk fail", err);
        });
    };
}
exports.loadEarlyMessageChunk = loadEarlyMessageChunk;
exports.GET_NEWER_MESSAGE = "GET_NEWER_MESSAGE";
exports.GET_NEWER_MESSAGE_FAILURE = "GET_NEWER_MESSAGE_FAILURE";
exports.GET_NEWER_MESSAGE_SUCCESS = "GET_NEWER_MESSAGE_SUCCESS";
const getNewerMessage = redux_actions_1.createAction(exports.GET_NEWER_MESSAGE);
const getNewerMessage_failure = redux_actions_1.createAction(exports.GET_NEWER_MESSAGE_FAILURE);
const getNewerMessage_success = redux_actions_1.createAction(exports.GET_NEWER_MESSAGE_SUCCESS, messages => messages);
function getNewerMessageFromNet() {
    return dispatch => {
        dispatch(getNewerMessage());
        simpleChat_1.ChatRoomComponent.getInstance().getNewerMessageRecord((results, room_id) => {
            dispatch(getNewerMessage_success(results));
            //# update messages read.
            if (results.length > 0) {
                dispatch(chatroomRxEpic_1.updateMessagesRead(results, room_id));
            }
        }).catch(err => {
            if (err) {
                console.warn("getNewerMessageRecord fail", err);
            }
            dispatch(getNewerMessage_failure());
        });
    };
}
exports.getNewerMessageFromNet = getNewerMessageFromNet;
function getMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        let chatroomComp = simpleChat_1.ChatRoomComponent.getInstance();
        let messages = yield chatroomComp.getMessages();
        return messages;
    });
}
exports.getMessages = getMessages;
const SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST";
const SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
exports.SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
const send_message_request = () => ({ type: SEND_MESSAGE_REQUEST });
const send_message_success = () => ({ type: SEND_MESSAGE_SUCCESS });
const send_message_failure = (error) => ({ type: exports.SEND_MESSAGE_FAILURE, payload: error });
function sendMessage(message) {
    return (dispatch) => {
        dispatch(send_message_request());
        let backendFactory = starter_1.BackendFactory.getInstance();
        let server = backendFactory.getServer();
        if (message.type === models_1.MessageType[models_1.MessageType.Text] && getConfig().appConfig.encryption === true) {
            const secure = starter_1.SecureServiceFactory.getService();
            secure.encryption(message.body).then(result => {
                message.body = result;
                if (!!server) {
                    let msg = {};
                    msg["data"] = message;
                    msg["x-api-key"] = Chitchat_1.config.Stalk.apiKey;
                    msg["api-version"] = Chitchat_1.config.Stalk.apiVersion;
                    server.getSocket().request("chat.chatHandler.pushByUids", msg, (result) => {
                        if (result.code !== 200) {
                            dispatch(sendMessageResponse(result, null));
                        }
                        else {
                            dispatch(sendMessageResponse(null, result));
                        }
                    });
                }
                else {
                    console.warn("Stalk server not initialized");
                }
            }).catch(err => {
                console.warn(err);
                dispatch(send_message_failure(err));
            });
        }
        else {
            if (!!server) {
                let msg = {};
                msg["data"] = message;
                msg["x-api-key"] = Chitchat_1.config.Stalk.apiKey;
                msg["api-version"] = Chitchat_1.config.Stalk.apiVersion;
                server.getSocket().request("chat.chatHandler.pushByUids", msg, (result) => {
                    if (result.code !== 200) {
                        dispatch(sendMessageResponse(result, null));
                    }
                    else {
                        dispatch(sendMessageResponse(null, result));
                    }
                });
            }
            else {
                console.warn("Stalk server not initialized");
            }
        }
    };
}
exports.sendMessage = sendMessage;
function sendMessageResponse(err, res) {
    return dispatch => {
        if (!!err) {
            dispatch(send_message_failure(err.message));
        }
        else {
            console.log("sendMessageResponse!", res);
            let chatroomComp = simpleChat_1.ChatRoomComponent.getInstance();
            if (res.code === stalk_js_1.HttpStatusCode.success && res.data.hasOwnProperty("resultMsg")) {
                let _msg = Object.assign({}, res.data.resultMsg);
                if (_msg.type === models_1.MessageType[models_1.MessageType.Text] && getConfig().appConfig.encryption) {
                    const secure = starter_1.SecureServiceFactory.getService();
                    secure.decryption(_msg.body).then(res => {
                        _msg.body = res;
                        chatroomComp.saveToPersisted(_msg);
                        dispatch(send_message_success());
                    }).catch(err => {
                        console.error(err);
                        _msg.body = err.toString();
                        chatroomComp.saveToPersisted(_msg);
                        dispatch(send_message_success());
                    });
                }
                else {
                    chatroomComp.saveToPersisted(_msg);
                    dispatch(send_message_success());
                }
            }
            else {
                dispatch(send_message_failure(res.message));
            }
        }
    };
}
const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
exports.JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
exports.JOIN_ROOM_FAILURE = "JOIN_ROOM_FAILURE";
const joinRoom_request = () => ({ type: JOIN_ROOM_REQUEST });
const joinRoom_success = (data) => ({ type: exports.JOIN_ROOM_SUCCESS, payload: data });
const joinRoom_failure = (error) => ({ type: exports.JOIN_ROOM_FAILURE, payload: error });
function joinRoom(roomId, token, username) {
    return (dispatch) => {
        dispatch(joinRoom_request());
        let backendFactory = starter_1.BackendFactory.getInstance();
        let server = backendFactory.getServer();
        if (!!server) {
            server.getLobby().joinRoom(token, username, roomId, (err, res) => {
                console.log("JoinChatRoomRequest value", res);
                if (err || res.code !== stalk_js_1.HttpStatusCode.success) {
                    dispatch(joinRoom_failure(err));
                }
                else {
                    dispatch(joinRoom_success());
                }
            });
        }
        else {
            dispatch(joinRoom_failure("Chat service not available."));
        }
    };
}
exports.joinRoom = joinRoom;
exports.LEAVE_ROOM = "LEAVE_ROOM";
exports.LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
const leaveRoom = () => ({ type: exports.LEAVE_ROOM });
const leaveRoomSuccess = () => ({ type: exports.LEAVE_ROOM_SUCCESS });
function leaveRoomAction() {
    return (dispatch) => {
        let _room = getStore().getState().chatroomReducer.get("room");
        let { id } = authReducer().user;
        if (!!_room) {
            let token = getStore().getState().stalkReducer.stalkToken;
            let room_id = _room._id;
            simpleChat_1.ChatRoomComponent.getInstance().dispose();
            NotificationManager.regisNotifyNewMessageEvent();
            dispatch(chatlogRxActions_1.updateLastAccessRoom(room_id, id));
            dispatch(leaveRoom());
        }
        else {
            dispatch({ type: "" });
        }
    };
}
exports.leaveRoomAction = leaveRoomAction;
exports.DISABLE_CHATROOM = "DISABLE_CHATROOM";
exports.ENABLE_CHATROOM = "ENABLE_CHATROOM";
exports.disableChatRoom = () => ({ type: exports.DISABLE_CHATROOM });
exports.enableChatRoom = () => ({ type: exports.ENABLE_CHATROOM });
exports.GET_PERSISTEND_CHATROOM = "GET_PERSISTEND_CHATROOM";
const GET_PERSISTEND_CHATROOM_CANCELLED = "GET_PERSISTEND_CHATROOM_CANCELLED";
exports.GET_PERSISTEND_CHATROOM_SUCCESS = "GET_PERSISTEND_CHATROOM_SUCCESS";
exports.GET_PERSISTEND_CHATROOM_FAILURE = "GET_PERSISTEND_CHATROOM_FAILURE";
const getPersistChatroomFail = (error) => ({ type: exports.GET_PERSISTEND_CHATROOM_FAILURE, payload: error });
const getPersistChatroomSuccess = (roomInfo) => ({ type: exports.GET_PERSISTEND_CHATROOM_SUCCESS, payload: roomInfo });
exports.getPersistendChatroom = (roomId) => (dispatch => {
    dispatch({ type: exports.GET_PERSISTEND_CHATROOM, payload: roomId });
    const { chatrooms } = getStore().getState().chatroomReducer;
    if (!chatrooms) {
        return dispatch(getPersistChatroomFail(undefined));
    }
    const rooms = chatrooms.filter((room, index, array) => {
        if (room._id.toString() === roomId) {
            return room;
        }
    });
    if (rooms.length > 0) {
        dispatch(getPersistChatroomSuccess(rooms[0]));
    }
    else {
        dispatch(getPersistChatroomFail(rooms));
    }
});
exports.getRoom = (room_id) => {
    let { chatrooms } = getStore().getState().chatroomReducer;
    if (!chatrooms) {
        return null;
    }
    const rooms = chatrooms.filter((room, index, array) => {
        if (room._id.toString() === room_id) {
            return room;
        }
    });
    return rooms[0];
};
exports.createChatRoom = (myUser, contactUser) => {
    if (myUser && contactUser) {
        let owner = {};
        owner._id = myUser._id;
        owner.user_role = (myUser.role) ? myUser.role : "user";
        owner.username = myUser.username;
        let contact = {};
        contact._id = contactUser._id;
        contact.user_role = (contactUser.role) ? contactUser.role : "user";
        contact.username = contactUser.username;
        let members = { owner, contact };
        return members;
    }
    else {
        console.warn("Not yet ready for create chatroom");
        return null;
    }
};
exports.UPDATED_CHATROOMS = "UPDATED_CHATROOMS";
exports.updatedChatRoomSuccess = (chatrooms) => ({ type: exports.UPDATED_CHATROOMS, payload: chatrooms });
exports.updateChatRoom = (rooms) => {
    return dispatch => {
        let chatrooms = getStore().getState().chatroomReducer.get("chatrooms");
        if (chatrooms) {
            // R.unionWith(R.eqBy(R.prop('a')), l1, l2);
            let _newRooms = R.unionWith(R.eqBy(R.prop("_id")), rooms, chatrooms);
            dispatch(exports.updatedChatRoomSuccess(_newRooms));
        }
        else {
            chatrooms = rooms.slice();
            dispatch(exports.updatedChatRoomSuccess(chatrooms));
        }
    };
};
