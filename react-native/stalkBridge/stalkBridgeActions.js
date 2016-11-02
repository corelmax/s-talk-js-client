/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import BackendFactory from "../../chats/BackendFactory";
import NotificationManager from "../../chats/notificationManager";
import DataManager from "../../chats/dataManager";
import * as DataModels from "../../chats/models/ChatDataModels";
import HTTPStatus from "../../libs/stalk/utils/httpStatusCode";
import Store from "../configureStore";
import * as ChatLogsActions from "../chatlogs/chatlogsActions";
import AccountService from "../../servicesAccess/accountService";
export const GET_PRIVATE_CHAT_ROOM_ID_REQUEST = "GET_PRIVATE_CHAT_ROOM_ID_REQUEST";
export const GET_PRIVATE_CHAT_ROOM_ID_FAILURE = "GET_PRIVATE_CHAT_ROOM_ID_FAILURE";
export const GET_PRIVATE_CHAT_ROOM_ID_SUCCESS = "GET_PRIVATE_CHAT_ROOM_ID_SUCCESS";
const onGetContactProfileFail = (contact_id) => {
    AccountService.getInstance().getUserInfo(contact_id).then(result => result.json()).then(result => {
        let user = result.data[0];
        let contact = {
            _id: user._id, displayname: `${user.first_name} ${user.last_name}`, status: "", image: user.avatar
        };
        DataManager.getInstance().setContactProfile(user._id, contact);
    }).catch(err => {
        console.log("get userInfo fail", err);
    });
};
export function getUserInfo(userId, callback) {
    let self = this;
    let user = DataManager.getInstance().getContactProfile(userId);
    if (!user) {
        AccountService.getInstance().getUserInfo(userId).then(result => result.json()).then(result => {
            let user = result.data[0];
            let contact = {
                _id: user._id, displayname: `${user.first_name} ${user.last_name}`, status: "", image: user.avatar
            };
            DataManager.getInstance().setContactProfile(user._id, contact);
            callback(contact);
        }).catch(err => {
            console.log("get userInfo fail", err);
            callback(null);
        });
    }
    else {
        callback(user);
    }
}
export function stalkLogin(uid, token) {
    console.log("stalkLogin", uid, token);
    BackendFactory.getInstance().stalkInit().then(value => {
        BackendFactory.getInstance().checkIn(uid, token).then(value => {
            console.log("Joined chat-server success", value.code);
            let result = JSON.parse(value.data);
            if (result.success) {
                BackendFactory.getInstance().getServerListener();
                BackendFactory.getInstance().startChatServerListener();
                NotificationManager.getInstance().regisNotifyNewMessageEvent();
                let msg = {};
                msg["token"] = token;
                BackendFactory.getInstance().getServer().getMe(msg, (err, res) => {
                    console.log("MyChat-Profile", res);
                    let account = new DataModels.StalkAccount();
                    account._id = result.decoded._id;
                    account.displayname = result.decoded.email;
                    let data = (!!res.data) ? res.data : account;
                    DataManager.getInstance().setProfile(data).then(profile => {
                        console.log("set chat profile success", profile);
                        ChatLogsActions.initChatsLog();
                    });
                    DataManager.getInstance().setSessionToken(token);
                    DataManager.getInstance().addContactInfoFailEvents(onGetContactProfileFail);
                });
            }
            else {
                console.warn("Cannot joined chat server.");
            }
        }).catch(err => {
            console.warn("Cannot checkIn", err);
        });
    }).catch(err => {
        console.warn("StalkInit Fail.");
    });
}
export function getPrivateChatRoomId(contactId) {
    return dispatch => {
        let profile = Store.getState().profileReducer.form.profile;
        let token = Store.getState().authReducer.token;
        dispatch({ type: GET_PRIVATE_CHAT_ROOM_ID_REQUEST });
        BackendFactory.getInstance().getServer().getPrivateChatRoomId(token, profile._id, contactId, function result(err, res) {
            if (res.code === HTTPStatus.success) {
                let room = JSON.parse(JSON.stringify(res.data));
                dispatch({ type: GET_PRIVATE_CHAT_ROOM_ID_SUCCESS, payload: room });
            }
            else {
                console.warn(err, res);
                dispatch({ type: GET_PRIVATE_CHAT_ROOM_ID_FAILURE });
            }
        });
    };
}
