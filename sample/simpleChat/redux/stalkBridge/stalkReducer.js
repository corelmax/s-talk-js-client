"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const StalkBridgeActions = require("./stalkBridgeActions");
const StalkNotificationActions = require("./stalkNotificationActions");
const immutable_1 = require("immutable");
/**
 * ## Initial State
 */
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
exports.StalkInitState = immutable_1.Record({
    isInit: false,
    isFetching: false,
    state: null,
    notiMessage: null,
    stalkToken: "",
    user: null,
    error: "",
});
const initialState = new exports.StalkInitState();
function stalkReducer(state = initialState, action) {
    if (!(state instanceof exports.StalkInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case StalkBridgeActions.STALK_INIT: {
            return state.set("isInit", false)
                .set("state", StalkBridgeActions.STALK_INIT);
        }
        case StalkBridgeActions.STALK_INIT_SUCCESS: {
            return state.set("isInit", true)
                .set("stalkToken", action.payload.token)
                .set("user", action.payload.user)
                .set("state", StalkBridgeActions.STALK_INIT_SUCCESS);
        }
        case StalkBridgeActions.STALK_INIT_FAILURE: {
            return state.set("isInit", true)
                .set("error", action.payload);
        }
        case StalkBridgeActions.STALK_LOGOUT_SUCCESS: {
            return initialState;
        }
        case StalkBridgeActions.STALK_ON_SOCKET_CLOSE: {
            return state.set("error", action.payload);
        }
        case StalkBridgeActions.STALK_ON_SOCKET_DISCONNECTED: {
            return state.set("error", action.payload);
        }
        case StalkBridgeActions.STALK_ON_SOCKET_RECONNECT: {
            return state.set("state", StalkBridgeActions.STALK_ON_SOCKET_RECONNECT);
        }
        case StalkNotificationActions.STALK_NOTICE_NEW_MESSAGE: {
            return state.set("notiMessage", action.payload);
        }
        default:
            return state;
    }
}
exports.stalkReducer = stalkReducer;
