/**
 *  NotificationManager
 * 
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */

import {
    AppState
} from 'react-native';

import BackendFactory from "./BackendFactory";
import { Message } from "../libs/chitchat/dataModel/message";
import PushNotifyHelper from '../libs/pushNotifyHelper';

import Store from "../reducers/configureStore";

export default class NotificationManager {
    private static instance: NotificationManager;
    public static getInstance(): NotificationManager {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }

        return NotificationManager.instance;
    }

    init(onSuccess: (err, deviceToken) => void) {
        console.log("Initialize NotificationManager.");

        PushNotifyHelper.getInstance().configure(onSuccess);
    }

    regisNotifyNewMessageEvent() {
        console.log("subscribe global notify message event");

        BackendFactory.getInstance().dataListener.addNoticeNewMessageEvent(this.notify);
    }

    unsubscribeGlobalNotifyMessageEvent() {
        BackendFactory.getInstance().dataListener.removeNoticeNewMessageEvent(this.notify);
    }

    notify(messageImp: Message) {
        //@ Check app not run in background.
        let device = Store.getState().deviceReducer; //active, background, inactive

        console.log("Notify Message. AppState is ", device.appState);

        if (device.appState == "active") {
            PushNotifyHelper.getInstance().localNotification(messageImp.body);
        }
        else if (device.appState != "active") {
            //@ When user joined room but appState is inActive.
            // sharedObjectService.getNotifyManager().notify(newMsg, appBackground, localNotifyService);

            PushNotifyHelper.getInstance().localNotification(messageImp.body);
        }
    }
}