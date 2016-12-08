/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
const BackendFactory_1 = require("../../chats/BackendFactory");
const notificationManager_1 = require("../../chats/notificationManager");
const DataModels = require("../../chats/models/ChatDataModels");
const httpStatusCode_1 = require("../../libs/stalk/utils/httpStatusCode");
const configureStore_1 = require("../configureStore");
const ChatLogsActions = require("../chatlogs/chatlogsActions");
const StalkPushActions = require("./stalkPushActions");
const accountService_1 = require("../../servicesAccess/accountService");
exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_REQUEST = "STALK_GET_PRIVATE_CHAT_ROOM_ID_REQUEST";
exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE = "STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE";
exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS = "STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS";
const onGetContactProfileFail = (contact_id) => {
    let dataManager = BackendFactory_1.default.getInstance().dataManager;
    accountService_1.default.getInstance().getUserInfo(contact_id).then(result => result.json()).then(result => {
        let user = result.data[0];
        let contact = {
            _id: user._id, displayname: `${user.first_name} ${user.last_name}`, status: "", image: user.avatar
        };
        dataManager.setContactProfile(user._id, contact);
    }).catch(err => {
        console.log("get userInfo fail", err);
    });
};
function getUserInfo(userId, callback) {
    let self = this;
    let dataManager = BackendFactory_1.default.getInstance().dataManager;
    let user = dataManager.getContactProfile(userId);
    if (!user) {
        accountService_1.default.getInstance().getUserInfo(userId).then(result => result.json()).then(result => {
            let user = result.data[0];
            let contact = {
                _id: user._id, displayname: `${user.first_name} ${user.last_name}`, status: "", image: user.avatar
            };
            dataManager.setContactProfile(user._id, contact);
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
    const backendFactory = BackendFactory_1.default.getInstance();
    console.log(backendFactory.dataManager);
    console.log(backendFactory.pushDataListener);
    console.log(backendFactory.dataListener);
    backendFactory.stalkInit().then(value => {
        backendFactory.checkIn(uid, token).then(value => {
            console.log("Joined chat-server success", value.code);
            let result = JSON.parse(value.data);
            if (result.success) {
                backendFactory.getServerListener();
                backendFactory.startChatServerListener();
                notificationManager_1.default.getInstance().regisNotifyNewMessageEvent();
                let msg = {};
                msg["token"] = token;
                backendFactory.getServer().then(server => {
                    server.getMe(msg, (err, res) => {
                        console.log("MyChat-Profile", res);
                        let account = new DataModels.StalkAccount();
                        account._id = result.decoded._id;
                        account.displayname = result.decoded.email;
                        let data = (!!res.data) ? res.data : account;
                        backendFactory.dataManager.setProfile(data).then(profile => {
                            console.log("set chat profile success", profile);
                            ChatLogsActions.initChatsLog();
                        });
                        backendFactory.dataManager.setSessionToken(token);
                        backendFactory.dataManager.addContactInfoFailEvents(onGetContactProfileFail);
                        StalkPushActions.stalkPushInit();
                    });
                }).catch(err => {
                    console.warn("Chat-server not yet ready");
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
        dispatch({ type: exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_REQUEST });
        BackendFactory_1.default.getInstance().getServer().then(server => {
            server.getPrivateChatRoomId(token, profile._id, contactId, function result(err, res) {
                if (res.code === httpStatusCode_1.default.success) {
                    let room = JSON.parse(JSON.stringify(res.data));
                    dispatch({ type: exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS, payload: room });
                }
                else {
                    console.warn(err, res);
                    dispatch({ type: exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE, payload: err });
                }
            });
        }).catch(err => {
            dispatch({ type: exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE, payload: err });
        });
    };
}
exports.getPrivateChatRoomId = getPrivateChatRoomId;
