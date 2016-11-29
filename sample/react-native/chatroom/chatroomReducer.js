/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
"use strict";
const chatroomActions_1 = require("./chatroomActions");
const StalkBridgeActions = require("../stalkBridge/stalkBridgeActions");
const immutable_1 = require('immutable');
/**
 * ## Initial State
 */
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
exports.ChatRoomInitState = immutable_1.Record({
    selectRoom: null,
    responseMessage: null,
    newMessage: null,
    messages: null,
    earlyMessageReady: false,
    isFetching: false,
    state: null
});
const initialState = new exports.ChatRoomInitState;
function chatRoomReducer(state = initialState, action) {
    if (!(state instanceof exports.ChatRoomInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case chatroomActions_1.ChatRoomActionsType.STOP: {
            return state.set("state", chatroomActions_1.ChatRoomActionsType.STOP);
        }
        case chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_REQUEST: {
            let nextState = state.set("state", chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_REQUEST)
                .set("isFetching", true);
            return nextState;
        }
        case chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_SUCCESS: {
            let payload = action.payload;
            let nextState = state.set("state", chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_SUCCESS)
                .set("isFetching", false)
                .set("responseMessage", payload);
            return nextState;
        }
        case chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_FAILURE: {
            let payload = action.payload;
            let nextState = state.set("state", chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_FAILURE)
                .set("isFetching", false)
                .set("responseMessage", payload);
            return nextState;
        }
        case chatroomActions_1.ChatRoomActionsType.REPLACE_MESSAGE: {
            let payload = action.payload;
            return state.set("state", chatroomActions_1.ChatRoomActionsType.REPLACE_MESSAGE)
                .set("newMessage", payload);
        }
        case chatroomActions_1.ChatRoomActionsType.ON_NEW_MESSAGE: {
            let payload = action.payload;
            return state.set("state", chatroomActions_1.ChatRoomActionsType.ON_NEW_MESSAGE)
                .set("newMessage", payload);
        }
        case chatroomActions_1.ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
            let payload = action.payload;
            return state.set("state", chatroomActions_1.ChatRoomActionsType.ON_EARLY_MESSAGE_READY)
                .set("earlyMessageReady", payload);
        }
        case chatroomActions_1.ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS: {
            return state.set("state", chatroomActions_1.ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS);
        }
        case chatroomActions_1.ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS: {
            return state.set("state", chatroomActions_1.ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS);
        }
        case chatroomActions_1.ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS: {
            return state.set("state", chatroomActions_1.ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS);
        }
        case chatroomActions_1.ChatRoomActionsType.SELECT_CHAT_ROOM: {
            let roomInfo = (!!action.payload) ? action.payload : state.get("selectRoom");
            return state
                .set("state", chatroomActions_1.ChatRoomActionsType.SELECT_CHAT_ROOM)
                .set("selectRoom", roomInfo);
        }
        case StalkBridgeActions.GET_PRIVATE_CHAT_ROOM_ID_REQUEST: {
            return state.set("isFetching", true);
        }
        case StalkBridgeActions.GET_PRIVATE_CHAT_ROOM_ID_FAILURE: {
            return state.set("isFetching", false);
        }
        case StalkBridgeActions.GET_PRIVATE_CHAT_ROOM_ID_SUCCESS: {
            let payload = action.payload;
            return state
                .set("isFetching", false)
                .set("selectRoom", payload)
                .set("state", StalkBridgeActions.GET_PRIVATE_CHAT_ROOM_ID_SUCCESS);
        }
        default:
            return state;
    }
}
exports.chatRoomReducer = chatRoomReducer;
