/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
const BackendFactory_1 = require("../../chats/BackendFactory");
const notificationManager_1 = require("../../chats/notificationManager");
const dataManager_1 = require("../../chats/dataManager");
const DataModels = require("../../chats/models/ChatDataModels");
const httpStatusCode_1 = require("../../libs/stalk/utils/httpStatusCode");
const configureStore_1 = require("../configureStore");
const ChatLogsActions = require("../chatlogs/chatlogsActions");
const accountService_1 = require("../../servicesAccess/accountService");
exports.GET_PRIVATE_CHAT_ROOM_ID_REQUEST = "GET_PRIVATE_CHAT_ROOM_ID_REQUEST";
exports.GET_PRIVATE_CHAT_ROOM_ID_FAILURE = "GET_PRIVATE_CHAT_ROOM_ID_FAILURE";
exports.GET_PRIVATE_CHAT_ROOM_ID_SUCCESS = "GET_PRIVATE_CHAT_ROOM_ID_SUCCESS";
const onGetContactProfileFail = (contact_id) => {
    accountService_1.default.getInstance().getUserInfo(contact_id).then(result => result.json()).then(result => {
        let user = result.data[0];
        let contact = {
            _id: user._id, displayname: `${user.first_name} ${user.last_name}`, status: "", image: user.avatar
        };
        dataManager_1.default.getInstance().setContactProfile(user._id, contact);
    }).catch(err => {
        console.log("get userInfo fail", err);
    });
};
function getUserInfo(userId, callback) {
    let self = this;
    let user = dataManager_1.default.getInstance().getContactProfile(userId);
    if (!user) {
        accountService_1.default.getInstance().getUserInfo(userId).then(result => result.json()).then(result => {
            let user = result.data[0];
            let contact = {
                _id: user._id, displayname: `${user.first_name} ${user.last_name}`, status: "", image: user.avatar
            };
            dataManager_1.default.getInstance().setContactProfile(user._id, contact);
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
exports.getUserInfo = getUserInfo;
function stalkLogin(uid, token) {
    console.log("stalkLogin", uid, token);
    BackendFactory_1.default.getInstance().stalkInit().then(value => {
        BackendFactory_1.default.getInstance().checkIn(uid, token).then(value => {
            console.log("Joined chat-server success", value.code);
            let result = JSON.parse(value.data);
            if (result.success) {
                BackendFactory_1.default.getInstance().getServerListener();
                BackendFactory_1.default.getInstance().startChatServerListener();
                notificationManager_1.default.getInstance().regisNotifyNewMessageEvent();
                let msg = {};
                msg["token"] = token;
                BackendFactory_1.default.getInstance().getServer().getMe(msg, (err, res) => {
                    console.log("MyChat-Profile", res);
                    let account = new DataModels.StalkAccount();
                    account._id = result.decoded._id;
                    account.displayname = result.decoded.email;
                    let data = (!!res.data) ? res.data : account;
                    dataManager_1.default.getInstance().setProfile(data).then(profile => {
                        console.log("set chat profile success", profile);
                        ChatLogsActions.initChatsLog();
                    });
                    dataManager_1.default.getInstance().setSessionToken(token);
                    dataManager_1.default.getInstance().addContactInfoFailEvents(onGetContactProfileFail);
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
exports.stalkLogin = stalkLogin;
function getPrivateChatRoomId(contactId) {
    return dispatch => {
        let profile = configureStore_1.default.getState().profileReducer.form.profile;
        let token = configureStore_1.default.getState().authReducer.token;
        dispatch({ type: exports.GET_PRIVATE_CHAT_ROOM_ID_REQUEST });
        BackendFactory_1.default.getInstance().getServer().getPrivateChatRoomId(token, profile._id, contactId, function result(err, res) {
            if (res.code === httpStatusCode_1.default.success) {
                let room = JSON.parse(JSON.stringify(res.data));
                dispatch({ type: exports.GET_PRIVATE_CHAT_ROOM_ID_SUCCESS, payload: room });
            }
            else {
                console.warn(err, res);
                dispatch({ type: exports.GET_PRIVATE_CHAT_ROOM_ID_FAILURE });
            }
        });
    };
}
exports.getPrivateChatRoomId = getPrivateChatRoomId;
