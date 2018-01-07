"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ChatlogsActions = require("../chatlogs/chatlogsActions");
const ChatlogRxActions = require("../chatlogs/chatlogRxActions");
const actions = require("../../../../actions/");
const immutable_1 = require("immutable");
// Define our record defaults
const defaultChatlog = {
    isFetching: false,
    state: "",
    chatsLog: [],
    roomAccess: null,
    error: ""
};
// Create our FruitRecord class
class ChatLogRecorder extends immutable_1.Record(defaultChatlog) {
    // Set the params. This will also typecheck when we instantiate a new FruitRecord
    constructor(params) {
        super(params);
    }
    // This following line is the magic. It overrides the "get" method of record
    // and lets typescript know the return type based on our IFruitParams interface
    get(value) {
        // super.get() is mapped to the original get() function on Record
        return super.get(value);
    }
}
exports.ChatLogRecorder = ChatLogRecorder;
exports.chatlogInitRecord = new ChatLogRecorder(defaultChatlog);
function chatlogReducer(state = exports.chatlogInitRecord, action) {
    switch (action.type) {
        case ChatlogsActions.ON_CHATLOG_CHANGE: {
            let prev = state.get("chatsLog");
            let next = prev.filter(log => log.rid != action.payload.rid);
            next.push(action.payload);
            return state.set("chatsLog", next);
        }
        case actions.GET_RECENT_MESSAGE_SUCCESS: {
            return state.set("chatsLog", action.payload);
        }
        case ChatlogRxActions.GET_LAST_ACCESS_ROOM: {
            return state.set("isFetching", true);
        }
        case ChatlogRxActions.GET_LAST_ACCESS_ROOM_SUCCESS: {
            let data = action.payload;
            if (Array.isArray(data) && data.length > 0) {
                return state.set("roomAccess", data[0].roomAccess).set("isFetching", false);
            }
            else {
                return state.set("isFetching", false);
            }
        }
        case ChatlogRxActions.GET_LAST_ACCESS_ROOM_FAILURE: {
            return state.set("roomAccess", null)
                .set("isFetching", false);
        }
        case ChatlogRxActions.UPDATE_LAST_ACCESS_ROOM_SUCCESS: {
            return state.set("roomAccess", action.payload)
                .set("isFetching", false);
        }
        case ChatlogRxActions.UPDATE_LAST_ACCESS_ROOM_FAILURE: {
            return state.set("isFetching", false);
        }
        case ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS: {
            return state.set("isFetching", true)
                .set("state", ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS);
        }
        case ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_SUCCESS: {
            let data = action.payload;
            if (Array.isArray(data) && data.length > 0) {
                return state.set("roomAccess", data[0].roomAccess)
                    .set("isFetching", false)
                    .set("state", ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_SUCCESS);
            }
            else {
                return state.set("isFetching", false)
                    .set("state", ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_SUCCESS);
            }
        }
        case ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_FAILURE: {
            return state.set("isFetching", false);
        }
        default:
            return state;
    }
}
exports.chatlogReducer = chatlogReducer;
