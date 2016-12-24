/**
 *  NotificationManager
 *
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
"use strict";
const BackendFactory_1 = require("./BackendFactory");
const ChatDataModels_1 = require("./models/ChatDataModels");
const pushNotifyHelper_1 = require("../libs/pushNotifyHelper");
const configureStore_1 = require("../reducers/configureStore");
class NotificationManager {
    static getInstance() {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    }
    init(onSuccess) {
        console.log("Initialize NotificationManager.");
        pushNotifyHelper_1.default.getInstance().configure(onSuccess);
    }
    regisNotifyNewMessageEvent() {
        console.log("subscribe global notify message event");
        BackendFactory_1.default.getInstance().dataListener.addNoticeNewMessageEvent(this.notify);
    }
    unsubscribeGlobalNotifyMessageEvent() {
        BackendFactory_1.default.getInstance().dataListener.removeNoticeNewMessageEvent(this.notify);
    }
    notify(messageImp) {
        //@ Check app not run in background.
        let device = configureStore_1.default.getState().deviceReducer; //active, background, inactive
        console.log("Notify Message. AppState is ", device.appState);
        let message = messageImp.body;
        if (messageImp.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Location]) {
            message = "Sent you location";
        }
        else if (messageImp.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Image]) {
            message = "Sent you image";
        }
        if (device.appState == "active") {
            pushNotifyHelper_1.default.getInstance().localNotification(message);
        }
        else if (device.appState != "active") {
            //@ When user joined room but appState is inActive.
            // sharedObjectService.getNotifyManager().notify(newMsg, appBackground, localNotifyService);
            pushNotifyHelper_1.default.getInstance().localNotification(message);
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotificationManager;
