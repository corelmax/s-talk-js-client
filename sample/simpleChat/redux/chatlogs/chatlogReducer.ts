/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */

import * as ChatlogsActions from "../chatlogs/chatlogsActions";
import * as ChatlogRxActions from "../chatlogs/chatlogRxActions";

import * as actions from "../../../../actions/";

import { Record } from "immutable";

// Define our record defaults
const defaultChatlog = {
    isFetching: false,
    state: "",
    chatsLog: [],
    roomAccess: null,
    error: ""
}

// Define our record types with a typescript interface 
interface IChatlog {
    isFetching: boolean;
    state: string;
    chatsLog: Array<any>;
    roomAccess: any;
    error: string;
}
// Create our FruitRecord class
export class ChatLogRecorder extends Record(defaultChatlog) {

    // Set the params. This will also typecheck when we instantiate a new FruitRecord
    constructor(params: IChatlog) {
        super(params);
    }

    // This following line is the magic. It overrides the "get" method of record
    // and lets typescript know the return type based on our IFruitParams interface
    get<T extends keyof IChatlog>(value: T): IChatlog[T] {

        // super.get() is mapped to the original get() function on Record
        return super.get(value)
    }

}
export const chatlogInitRecord = new ChatLogRecorder(defaultChatlog);

export function chatlogReducer(state = chatlogInitRecord, action) {
    switch (action.type) {
        case ChatlogsActions.ON_CHATLOG_CHANGE: {
            let prev = state.get("chatsLog") as Array<any>;
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