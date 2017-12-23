"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const BackendFactory_1 = require("../../chats/BackendFactory");
const configureStore_1 = require("../configureStore");
const ProfileActions = require("../profile/profileActions");
const notificationsActions = require("../../reducers/notifications/notificationsActions");
const LINK_REQUEST = "LINK_REQUEST";
const LINK_ACCEPTED = "LINK_ACCEPTED";
const NEW_NOTICE = 'NEW_NOTICE';
function stalkPushInit() {
    const pushDataListener = BackendFactory_1.default.getInstance().pushDataListener;
    pushDataListener.addPushEvents(onPush_handler);
}
exports.stalkPushInit = stalkPushInit;
function onPush_handler(dataEvent) {
    //  console.log(`Event : ${dataEvent}`);
    if (dataEvent) {
        let profile = configureStore_1.default.getState().profileReducer.form.profile;
        switch (dataEvent.event) {
            case LINK_REQUEST: {
                configureStore_1.default.dispatch(ProfileActions.getLinkRequestFromNet(profile.email));
                break;
            }
            case LINK_ACCEPTED: {
                configureStore_1.default.dispatch(ProfileActions.getLinkRequestFromNet(profile.email));
                break;
            }
            case NEW_NOTICE:
                {
                    configureStore_1.default.dispatch(notificationsActions.getNotifications(profile._id));
                }
                break;
            default:
                {
                    console.log(`Other : ${dataEvent}`);
                }
                break;
        }
    }
}
