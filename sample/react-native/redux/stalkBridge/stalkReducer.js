/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
"use strict";
var ChatlogsActions = require("../chatlogs/chatlogsActions");
var authActions_1 = require("../auth/authActions");
var immutable_1 = require("immutable");
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
    chatslogComponent: null,
    chatsLog: null,
    isFetching: false,
    state: null
});
var initialState = new exports.StalkInitState;
function stalkReducer(state, action) {
    if (state === void 0) { state = initialState; }
    if (!(state instanceof exports.StalkInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case ChatlogsActions.STALK_INIT_CHATSLOG: {
            return state.set("isInit", true)
                .set("chatslogComponent", action.payload);
        }
        case ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE: {
            return state.set("chatsLog", action.payload).set("state", ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE);
        }
        case ChatlogsActions.STALK_CHATSLOG_CONTACT_COMPLETE: {
            var nextState = state.set("state", ChatlogsActions.STALK_CHATSLOG_CONTACT_COMPLETE)
                .set("chatsLog", action.payload);
            return nextState;
        }
        case ChatlogsActions.STALK_UNREAD_MAP_CHANGED: {
            var nextState = state.set("chatsLog", action.payload)
                .set("state", ChatlogsActions.STALK_UNREAD_MAP_CHANGED);
            return nextState;
        }
        case authActions_1.AuthenActionsType.LOGOUT_SUCCESS: {
            return initialState;
        }
        default:
            return state;
    }
}
exports.stalkReducer = stalkReducer;
