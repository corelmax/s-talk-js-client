/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
import * as ChatlogsActions from "../chatlogs/chatlogsActions";
import { AuthenActionsType } from "../auth/authActions";
import { Record } from 'immutable';
/**
 * ## Initial State
 */
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
export const StalkInitState = Record({
    isInit: false,
    chatslogComponent: null,
    chatsLog: null,
    isFetching: false,
    state: null
});
const initialState = new StalkInitState;
export function stalkReducer(state = initialState, action) {
    if (!(state instanceof StalkInitState))
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
        case AuthenActionsType.LOGOUT_SUCCESS: {
            return initialState;
        }
        default:
            return state;
    }
}
