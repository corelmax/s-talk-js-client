"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BackendFactory_1 = require("../../../../starter/BackendFactory");
const StalkNotificationAction = require("./stalkNotificationActions");
// import * as ChatLogsActions from "../chatlogs/chatlogsActions";
const redux_actions_1 = require("redux-actions");
const getStore = () => chitchatFactory.getStore();
const getConfig = () => chitchatFactory.getConfig();
exports.getSessionToken = () => {
    const backendFactory = BackendFactory_1.BackendFactory.getInstance();
    return getStore().getState().stalkReducer.stalkToken;
};
const onGetContactProfileFail = (contact_id) => { };
exports.STALK_INIT = "STALK_INIT";
exports.STALK_INIT_SUCCESS = "STALK_INIT_SUCCESS";
exports.STALK_INIT_FAILURE = "STALK_INIT_FAILURE";
const stalkInitFailure = redux_actions_1.createAction(exports.STALK_INIT_FAILURE, (payload) => payload);
exports.STALK_LOGOUT = "STALK_LOGOUT";
exports.STALK_LOGOUT_SUCCESS = "STALK_LOGOUT_SUCCESS";
exports.STALK_LOGOUT_FAILURE = "STALK_LOGOUT_FAILURE";
const stalkLogoutSuccess = redux_actions_1.createAction(exports.STALK_LOGOUT_SUCCESS);
function stalkLogin(user) {
    if (getStore().getState().stalkReducer.isInit) {
        console.log("s-talk service is initiated");
        return;
    }
    getStore().dispatch({ type: exports.STALK_INIT });
    const backendFactory = BackendFactory_1.BackendFactory.createInstance(getConfig().Stalk, getConfig().api);
    backendFactory.stalkInit().then(socket => {
        backendFactory.handshake(user._id).then((connector) => {
            backendFactory.checkIn(user).then((value) => {
                console.log("Joined stalk-service success", value);
                let result = JSON.parse(JSON.stringify(value.data));
                if (result.success) {
                    stalkManageConnection().then(function (server) {
                        if (!!server) {
                            server.listenSocketEvents();
                            backendFactory.getServerListener();
                            backendFactory.subscriptions();
                            StalkNotificationAction.regisNotifyNewMessageEvent();
                            // StalkPushActions.stalkPushInit();
                            getStore().dispatch({ type: exports.STALK_INIT_SUCCESS, payload: { token: result.token, user: user } });
                        }
                        else {
                            console.warn("Stalk subscription fail: ");
                            getStore().dispatch({ type: exports.STALK_INIT_FAILURE, payload: "Realtime service unavailable." });
                        }
                    }).catch(err => {
                        console.warn("Stalk subscription fail: ", err);
                        getStore().dispatch({ type: exports.STALK_INIT_FAILURE, payload: err });
                    });
                }
                else {
                    console.warn("Joined chat-server fail: ", result);
                    getStore().dispatch({ type: exports.STALK_INIT_FAILURE });
                }
            }).catch(err => {
                console.warn("Cannot checkIn", err);
                getStore().dispatch({ type: exports.STALK_INIT_FAILURE });
            });
        }).catch(err => {
            console.warn("Hanshake fail: ", err);
            getStore().dispatch({ type: exports.STALK_INIT_FAILURE });
        });
    }).catch(err => {
        console.log("StalkInit Fail.", err);
        getStore().dispatch(stalkInitFailure("Realtime service unavailable."));
    });
}
exports.stalkLogin = stalkLogin;
exports.STALK_ON_SOCKET_RECONNECT = "STALK_ON_SOCKET_RECONNECT";
exports.STALK_ON_SOCKET_CLOSE = "STALK_ON_SOCKET_CLOSE";
exports.STALK_ON_SOCKET_DISCONNECTED = "STALK_ON_SOCKET_DISCONNECTED";
const onStalkSocketReconnect = (data) => ({ type: exports.STALK_ON_SOCKET_RECONNECT, payload: data });
const onStalkSocketClose = (data) => ({ type: exports.STALK_ON_SOCKET_CLOSE, payload: data });
const onStalkSocketDisconnected = (data) => ({ type: exports.STALK_ON_SOCKET_DISCONNECTED, payload: data });
function stalkManageConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const backendFactory = BackendFactory_1.BackendFactory.getInstance();
        let server = backendFactory.getServer();
        if (!!server) {
            server.onSocketReconnect = (data) => {
                getStore().dispatch(onStalkSocketReconnect(data.type));
            };
            server.onSocketClose = (data) => {
                getStore().dispatch(onStalkSocketClose("Connection closed"));
            };
            server.onDisconnected = (data) => {
                getStore().dispatch(onStalkSocketDisconnected("Connection disconnected"));
            };
        }
        return yield server;
    });
}
function stalkLogout() {
    return __awaiter(this, void 0, void 0, function* () {
        const backendFactory = BackendFactory_1.BackendFactory.getInstance();
        getStore().dispatch(stalkLogoutSuccess());
        try {
            return yield backendFactory.logout();
        }
        catch (ex) {
            return yield ex.message;
        }
    });
}
exports.stalkLogout = stalkLogout;
