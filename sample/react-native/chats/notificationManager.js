/**
 *  NotificationManager
 *
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
"use strict";
var BackendFactory_1 = require("./BackendFactory");
var ChatDataModels_1 = require("./models/ChatDataModels");
var pushNotifyHelper_1 = require("../libs/pushNotifyHelper");
var configureStore_1 = require("../reducers/configureStore");
var NotificationManager = (function () {
    function NotificationManager() {
    }
    NotificationManager.getInstance = function () {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    };
    NotificationManager.prototype.init = function (onSuccess) {
        console.log("Initialize NotificationManager.");
        pushNotifyHelper_1["default"].getInstance().configure(onSuccess);
    };
    NotificationManager.prototype.regisNotifyNewMessageEvent = function () {
        console.log("subscribe global notify message event");
        BackendFactory_1["default"].getInstance().dataListener.addNoticeNewMessageEvent(this.notify);
    };
    NotificationManager.prototype.unsubscribeGlobalNotifyMessageEvent = function () {
        BackendFactory_1["default"].getInstance().dataListener.removeNoticeNewMessageEvent(this.notify);
    };
    NotificationManager.prototype.notify = function (messageImp) {
        //@ Check app not run in background.
        var device = configureStore_1["default"].getState().deviceReducer; //active, background, inactive
        console.log("Notify Message. AppState is ", device.appState);
        var message = messageImp.body;
        if (messageImp.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Location]) {
            message = "Sent you location";
        }
        else if (messageImp.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Image]) {
            message = "Sent you image";
        }
        if (device.appState == "active") {
            pushNotifyHelper_1["default"].getInstance().localNotification(message);
        }
        else if (device.appState != "active") {
            //@ When user joined room but appState is inActive.
            // sharedObjectService.getNotifyManager().notify(newMsg, appBackground, localNotifyService);
            pushNotifyHelper_1["default"].getInstance().localNotification(message);
        }
    };
    return NotificationManager;
}());
exports.__esModule = true;
exports["default"] = NotificationManager;
