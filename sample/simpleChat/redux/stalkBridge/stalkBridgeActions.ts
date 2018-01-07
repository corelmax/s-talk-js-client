/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import { BackendFactory } from "../../../../starter/BackendFactory";
import { StalkAccount, RoomAccessData } from "../../../../starter/models";
import * as StalkNotificationAction from "./stalkNotificationActions";
// import * as ChatLogsActions from "../chatlogs/chatlogsActions";

import { createAction } from "redux-actions";

import InternalStore from "../../InternalStore";
const getStore = () => chitchatFactory.getStore();
const getConfig = () => chitchatFactory.getConfig();

export const getSessionToken = () => {
    const backendFactory = BackendFactory.getInstance();
    return getStore().getState().stalkReducer.stalkToken;
};
const onGetContactProfileFail = (contact_id: string) => { };

export const STALK_INIT = "STALK_INIT";
export const STALK_INIT_SUCCESS = "STALK_INIT_SUCCESS";
export const STALK_INIT_FAILURE = "STALK_INIT_FAILURE";
const stalkInitFailure = createAction(STALK_INIT_FAILURE, (payload: string) => payload);

export const STALK_LOGOUT = "STALK_LOGOUT";
export const STALK_LOGOUT_SUCCESS = "STALK_LOGOUT_SUCCESS";
export const STALK_LOGOUT_FAILURE = "STALK_LOGOUT_FAILURE";
const stalkLogoutSuccess = createAction(STALK_LOGOUT_SUCCESS);

export function stalkLogin(user: StalkAccount) {
    if (getStore().getState().stalkReducer.isInit) {
        console.log("s-talk service is initiated")
        return;
    }

    getStore().dispatch({ type: STALK_INIT });

    const backendFactory = BackendFactory.createInstance(getConfig().Stalk, getConfig().api);

    backendFactory.stalkInit().then(socket => {
        backendFactory.handshake(user._id).then((connector) => {
            backendFactory.checkIn(user).then((value: any) => {
                console.log("Joined stalk-service success", value);
                let result: { success: boolean, token: any } = JSON.parse(JSON.stringify(value.data));
                if (result.success) {
                    stalkManageConnection().then(function (server) {
                        if (!!server) {
                            server.listenSocketEvents();
                            backendFactory.getServerListener();
                            backendFactory.subscriptions();
                            StalkNotificationAction.regisNotifyNewMessageEvent();
                            // StalkPushActions.stalkPushInit();

                            getStore().dispatch({ type: STALK_INIT_SUCCESS, payload: { token: result.token, user: user } });
                        }
                        else {
                            console.warn("Stalk subscription fail: ");
                            getStore().dispatch({ type: STALK_INIT_FAILURE, payload: "Realtime service unavailable." });
                        }
                    }).catch(err => {
                        console.warn("Stalk subscription fail: ", err);
                        getStore().dispatch({ type: STALK_INIT_FAILURE, payload: err });
                    });
                }
                else {
                    console.warn("Joined chat-server fail: ", result);
                    getStore().dispatch({ type: STALK_INIT_FAILURE });
                }
            }).catch(err => {
                console.warn("Cannot checkIn", err);
                getStore().dispatch({ type: STALK_INIT_FAILURE });
            });
        }).catch(err => {
            console.warn("Hanshake fail: ", err);
            getStore().dispatch({ type: STALK_INIT_FAILURE });
        });
    }).catch(err => {
        console.log("StalkInit Fail.", err);
        getStore().dispatch(stalkInitFailure("Realtime service unavailable."));
    });
}

export const STALK_ON_SOCKET_RECONNECT = "STALK_ON_SOCKET_RECONNECT";
export const STALK_ON_SOCKET_CLOSE = "STALK_ON_SOCKET_CLOSE";
export const STALK_ON_SOCKET_DISCONNECTED = "STALK_ON_SOCKET_DISCONNECTED";
const onStalkSocketReconnect = (data: any) => ({ type: STALK_ON_SOCKET_RECONNECT, payload: data });
const onStalkSocketClose = (data: any) => ({ type: STALK_ON_SOCKET_CLOSE, payload: data });
const onStalkSocketDisconnected = (data: any) => ({ type: STALK_ON_SOCKET_DISCONNECTED, payload: data });
async function stalkManageConnection() {
    const backendFactory = BackendFactory.getInstance();

    let server = backendFactory.getServer();
    if (!!server) {
        server.onSocketReconnect = (data: any) => {
            getStore().dispatch(onStalkSocketReconnect(data.type));
        };
        server.onSocketClose = (data: any) => {
            getStore().dispatch(onStalkSocketClose("Connection closed"));
        };
        server.onDisconnected = (data: any) => {
            getStore().dispatch(onStalkSocketDisconnected("Connection disconnected"));
        };
    }

    return await server;
}

export async function stalkLogout() {
    const backendFactory = BackendFactory.getInstance();
    getStore().dispatch(stalkLogoutSuccess());
    try {
        return await backendFactory.logout();
    } catch (ex) {
        return await ex.message;
    }
}
