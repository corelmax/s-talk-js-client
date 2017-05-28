/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
var BackendFactory_1 = require("../../chats/BackendFactory");
var configureStore_1 = require("../configureStore");
var ProfileActions = require("../profile/profileActions");
var notificationsActions = require("../../reducers/notifications/notificationsActions");
var LINK_REQUEST = "LINK_REQUEST";
var LINK_ACCEPTED = "LINK_ACCEPTED";
var NEW_NOTICE = 'NEW_NOTICE';
function stalkPushInit() {
    var pushDataListener = BackendFactory_1.default.getInstance().pushDataListener;
    pushDataListener.addPushEvents(onPush_handler);
}
exports.stalkPushInit = stalkPushInit;
function onPush_handler(dataEvent) {
    //  console.log(`Event : ${dataEvent}`);
    if (dataEvent) {
        var profile = configureStore_1.default.getState().profileReducer.form.profile;
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
                    console.log("Other : " + dataEvent);
                }
                break;
        }
    }
}
