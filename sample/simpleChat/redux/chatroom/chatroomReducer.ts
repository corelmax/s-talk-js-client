/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */

import * as immutable from "immutable";

import {
    ON_EARLY_MESSAGE_READY,
    SEND_MESSAGE_FAILURE,
    GET_NEWER_MESSAGE_SUCCESS,
    GET_NEWER_MESSAGE_FAILURE,
    ON_MESSAGE_CHANGED
} from "./chatroomActions";
import * as chatroomRxActions from "./chatroomRxEpic";
import * as chatroomActions from "./chatroomActions";
import * as StalkBridgeActions from "../stalkBridge/stalkBridgeActions";
import * as chatlogsActions from "../chatlogs/chatlogsActions";

import { Room, MessageImp } from "stalk-js/starter/simpleChat/models"
import { GET_ALL_CHATROOM_SUCCESS } from "../../../../actions/chatlistsRx";

// Define our record defaults
const chatroomDefaults = {
    isFetching: false,
    state: "",
    room: null,
    chatTargets: "*",
    responseFile: null,
    messages: [],
    earlyMessageReady: false,
    uploadingFile: null,
    fileInfo: null,
    error: null,
    chatDisabled: false,
    chatrooms: []
} as IChatroom;
// Define our record types with a typescript interface 
interface IChatroom {
    isFetching: boolean;
    state: string;
    room: Room | null;
    chatTargets: Array<string> | string;
    responseFile: any;
    messages: Array<MessageImp>;
    earlyMessageReady: any;
    uploadingFile: any;
    fileInfo: any;
    error: any;
    chatDisabled: boolean;
    chatrooms: Array<Room>;
}
// Create our FruitRecord class
export class ChatRoomRecoder extends immutable.Record(chatroomDefaults) {
    // Set the params. This will also typecheck when we instantiate a new FruitRecord
    constructor(params: IChatroom) {
        super(params);
    }

    // This following line is the magic. It overrides the "get" method of record
    // and lets typescript know the return type based on our IFruitParams interface
    get<T extends keyof IChatroom>(value: T): IChatroom[T] {
        // super.get() is mapped to the original get() function on Record
        return super.get(value)
    }
    // set<T extends keyof IChatroom>(key: T, value): IChatroom[T] {
    //     return super.set(key, value);
    // }
}
export const chatRoomRecoder = new ChatRoomRecoder(chatroomDefaults);
export const chatroomReducer = (state = chatRoomRecoder, action) => {
    switch (action.type) {
        case GET_ALL_CHATROOM_SUCCESS: {
            return state.set("chatrooms", action.payload);
        }
        case chatroomActions.JOIN_ROOM_FAILURE: {
            return state.set("state", chatroomActions.JOIN_ROOM_FAILURE)
                .set("chatDisabled", true);
        }
        case chatroomActions.JOIN_ROOM_SUCCESS: {
            return state.set("state", chatroomActions.JOIN_ROOM_SUCCESS)
                .set("chatDisabled", false);
        }

        case chatroomActions.DISABLE_CHATROOM: {
            return state.set("state", chatroomActions.DISABLE_CHATROOM)
                .set("chatDisabled", true);
        }
        case chatroomActions.ENABLE_CHATROOM: {
            return state.set("state", chatroomActions.ENABLE_CHATROOM)
                .set("chatDisabled", false);
        }

        case chatroomRxActions.CHATROOM_UPLOAD_FILE: {
            return state.set("state", chatroomRxActions.CHATROOM_UPLOAD_FILE)
                .set("uploadingFile", action.payload.data.target.result)
                .set("fileInfo", action.payload.file); // action.payload.form['file']
        }
        case chatroomRxActions.CHATROOM_UPLOAD_FILE_FAILURE: {
            return state.set("state", chatroomRxActions.CHATROOM_UPLOAD_FILE_FAILURE)
                .set("error", JSON.stringify(action.payload.message));
        }
        case chatroomRxActions.CHATROOM_UPLOAD_FILE_SUCCESS: {
            return state.set("state", chatroomRxActions.CHATROOM_UPLOAD_FILE_SUCCESS)
                .set("responseFile", action.payload);
        }

        case SEND_MESSAGE_FAILURE: {
            let payload = action.payload;
            let nextState = state.set("state", SEND_MESSAGE_FAILURE)
                .set("isFetching", false)
                .set("error", payload);

            return nextState;
        }
        case ON_MESSAGE_CHANGED: {
            let payload = action.payload;
            return state.set("messages", payload);
        }
        case ON_EARLY_MESSAGE_READY: {
            let payload = action.payload;
            return state.set("state", ON_EARLY_MESSAGE_READY)
                .set("earlyMessageReady", payload);
        }
        case chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS: {
            let payload = action.payload;
            return state.set("messages", payload)
                .set("state", chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS);
        }

        case chatroomRxActions.GET_PERSISTEND_MESSAGE_SUCCESS: {
            let payload = action.payload;
            return state.set("messages", payload);
        }
        case GET_NEWER_MESSAGE_SUCCESS: {
            let payload = action.payload;
            return state.set("messages", payload);
        }

        /**Create chat room */
        case chatroomRxActions.GET_MY_ROOM_SUCCESS: {
            return state.set("isFetching", false)
                .set("state", chatroomRxActions.GET_MY_ROOM_SUCCESS)
                .set("room", action.payload);
        }
        case chatroomRxActions.GET_MY_ROOM_FAILURE: {
            return state.set("isFetching", false)
                .set("state", chatroomRxActions.GET_MY_ROOM_FAILURE)
                .set("room", null);
        }

        /**Fetch chat room */
        case chatroomRxActions.FETCH_PRIVATE_CHATROOM:
            return state.set("isFetching", true);
        case chatroomRxActions.FETCH_PRIVATE_CHATROOM_SUCCESS:
            return state.set("room", action.payload)
                .set("isFetching", false)
                .set("state", chatroomRxActions.FETCH_PRIVATE_CHATROOM_SUCCESS);
        case chatroomRxActions.FETCH_PRIVATE_CHATROOM_CANCELLED:
            return state.set("isFetching", false);
        case chatroomRxActions.FETCH_PRIVATE_CHATROOM_FAILURE:
            return state.set("state", chatroomRxActions.FETCH_PRIVATE_CHATROOM_FAILURE)
                .set("isFetching", false)
                .set("room", null);

        /** Set room */
        case chatroomActions.GET_PERSISTEND_CHATROOM:
            return state.set("isFetching", false);
        case chatroomActions.GET_PERSISTEND_CHATROOM_SUCCESS: {
            return state.set("room", action.payload);
        }
        case chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
            return state.set("room", null);
        }

        /**Set room empty */
        case chatroomActions.LEAVE_ROOM: {
            return state
                .set("state", chatroomActions.LEAVE_ROOM)
                .set("room", null);
        }

        case chatroomActions.UPDATED_CHATROOMS: {
            return state.set("chatrooms", action.payload);
        }

        // case actions.GET_ADMIN_ROLE_IDS_SUCCESS: {
        //     return state.set("chatTargets", action.payload);
        // }
        // case actions.GET_CHAT_TARGET_ID: {
        //     return state.set("chatTargets", [action.payload]);
        // }

        default:
            return state;
    }
};