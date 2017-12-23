/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
import { ChatRoomActionsType } from "./chatroomActions";
import * as StalkBridgeActions from "../stalkBridge/stalkBridgeActions";
import { Record } from 'immutable';
/**
 * ## Initial State
 */
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
export const ChatRoomInitState = Record({
    selectRoom: null,
    responseMessage: null,
    newMessage: null,
    messages: null,
    earlyMessageReady: false,
    isFetching: false,
    state: null,
    error: null,
});
const initialState = new ChatRoomInitState;
export function chatRoomReducer(state = initialState, action) {
    if (!(state instanceof ChatRoomInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case ChatRoomActionsType.STOP: {
            return state.set("state", ChatRoomActionsType.STOP);
        }
        case ChatRoomActionsType.SEND_MESSAGE_REQUEST: {
            let nextState = state.set("state", ChatRoomActionsType.SEND_MESSAGE_REQUEST)
                .set("isFetching", true);
            return nextState;
        }
        case ChatRoomActionsType.SEND_MESSAGE_SUCCESS: {
            let payload = action.payload;
            let nextState = state.set("state", ChatRoomActionsType.SEND_MESSAGE_SUCCESS)
                .set("isFetching", false)
                .set("responseMessage", payload);
            return nextState;
        }
        case ChatRoomActionsType.SEND_MESSAGE_FAILURE: {
            let payload = action.payload;
            let nextState = state.set("state", ChatRoomActionsType.SEND_MESSAGE_FAILURE)
                .set("isFetching", false)
                .set("responseMessage", payload);
            return nextState;
        }
        case ChatRoomActionsType.REPLACE_MESSAGE: {
            let payload = action.payload;
            return state.set("state", ChatRoomActionsType.REPLACE_MESSAGE)
                .set("newMessage", payload);
        }
        case ChatRoomActionsType.ON_NEW_MESSAGE: {
            let payload = action.payload;
            return state.set("state", ChatRoomActionsType.ON_NEW_MESSAGE)
                .set("newMessage", payload);
        }
        case ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
            let payload = action.payload;
            return state.set("state", ChatRoomActionsType.ON_EARLY_MESSAGE_READY)
                .set("earlyMessageReady", payload);
        }
        case ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS: {
            return state.set("state", ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS);
        }
        case ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS: {
            return state.set("state", ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS);
        }
        case ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS: {
            return state.set("state", ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS);
        }
        case ChatRoomActionsType.SELECT_CHAT_ROOM: {
            let roomInfo = (!!action.payload) ? action.payload : state.get("selectRoom");
            return state
                .set("state", ChatRoomActionsType.SELECT_CHAT_ROOM)
                .set("selectRoom", roomInfo);
        }
        case StalkBridgeActions.STALK_GET_PRIVATE_CHAT_ROOM_ID_REQUEST: {
            return state.set("isFetching", true);
        }
        case StalkBridgeActions.STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE: {
            return state.set("isFetching", false)
                .set("error", action.payload);
        }
        case StalkBridgeActions.STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS: {
            let payload = action.payload;
            return state
                .set("isFetching", false)
                .set("selectRoom", payload)
                .set("state", StalkBridgeActions.STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS);
        }
        default:
            return state;
    }
}
