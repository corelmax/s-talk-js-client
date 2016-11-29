/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
"use strict";
const ChatlogsActions = require("../chatlogs/chatlogsActions");
const authActions_1 = require("../auth/authActions");
const immutable_1 = require('immutable');
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
const initialState = new exports.StalkInitState;
function stalkReducer(state = initialState, action) {
    if (!(state instanceof exports.StalkInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case ChatlogsActions.INIT_CHATSLOG: {
            return state.set("isInit", true)
                .set("chatslogComponent", action.payload);
        }
        case ChatlogsActions.GET_CHATSLOG_COMPLETE: {
            return state.set("chatsLog", action.payload);
        }
        case ChatlogsActions.UNREAD_MAP_CHANGED: {
            let nextState = state.set("chatsLog", action.payload)
                .set("state", ChatlogsActions.UNREAD_MAP_CHANGED);
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
