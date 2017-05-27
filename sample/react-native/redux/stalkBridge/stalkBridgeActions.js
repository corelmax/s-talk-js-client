/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
var BackendFactory_1 = require("../../chats/BackendFactory");
var notificationManager_1 = require("../../chats/notificationManager");
var DataModels = require("../../chats/models/ChatDataModels");
var httpStatusCode_1 = require("../../libs/stalk/utils/httpStatusCode");
var configureStore_1 = require("../configureStore");
var ChatLogsActions = require("../chatlogs/chatlogsActions");
var StalkPushActions = require("./stalkPushActions");
var accountService_1 = require("../../servicesAccess/accountService");
exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_REQUEST = "STALK_GET_PRIVATE_CHAT_ROOM_ID_REQUEST";
exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE = "STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE";
exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS = "STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS";
var onGetContactProfileFail = function (contact_id) {
    var dataManager = BackendFactory_1["default"].getInstance().dataManager;
    accountService_1["default"].getInstance().getUserInfo(contact_id).then(function (result) { return result.json(); }).then(function (result) {
        if (result.success) {
            var user = result.data[0];
            var contact = {
                _id: user._id, displayname: user.first_name + " " + user.last_name, status: "", image: user.avatar
            };
            dataManager.setContactProfile(user._id, contact);
        }
    })["catch"](function (err) {
        console.warn("onGetContactProfileFail", err);
    });
};
function getUserInfo(userId, callback) {
    var self = this;
    var dataManager = BackendFactory_1["default"].getInstance().dataManager;
    var user = dataManager.getContactProfile(userId);
    if (!user) {
        accountService_1["default"].getInstance().getUserInfo(userId).then(function (result) { return result.json(); }).then(function (result) {
            var user = result.data[0];
            var contact = {
                _id: user._id, displayname: user.first_name + " " + user.last_name, status: "", image: user.avatar
            };
            dataManager.setContactProfile(user._id, contact);
            callback(contact);
        })["catch"](function (err) {
            console.warn("getUserInfo fail", err);
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
    var backendFactory = BackendFactory_1["default"].getInstance();
    backendFactory.stalkInit().then(function (value) {
        backendFactory.checkIn(uid, token).then(function (value) {
            console.log("Joined chat-server success", value.code);
            var result = JSON.parse(value.data);
            if (result.success) {
                backendFactory.getServerListener();
                backendFactory.startChatServerListener();
                notificationManager_1["default"].getInstance().regisNotifyNewMessageEvent();
                var msg_1 = {};
                msg_1["token"] = token;
                backendFactory.getServer().then(function (server) {
                    server.getMe(msg_1, function (err, res) {
                        console.log("MyChat-Profile", res);
                        var account = new DataModels.StalkAccount();
                        account._id = result.decoded._id;
                        account.displayname = result.decoded.email;
                        var data = (!!res.data) ? res.data : account;
                        backendFactory.dataManager.setProfile(data).then(function (profile) {
                            console.log("set chat profile success", profile);
                            ChatLogsActions.initChatsLog();
                        });
                        backendFactory.dataManager.setSessionToken(token);
                        backendFactory.dataManager.addContactInfoFailEvents(onGetContactProfileFail);
                        StalkPushActions.stalkPushInit();
                    });
                })["catch"](function (err) {
                    console.warn("Chat-server not yet ready");
                });
            }
            else {
                console.warn("Cannot joined chat server.");
            }
        })["catch"](function (err) {
            console.warn("Cannot checkIn", err);
        });
    })["catch"](function (err) {
        console.warn("StalkInit Fail.");
    });
}
exports.stalkLogin = stalkLogin;
function getPrivateChatRoomId(contactId) {
    return function (dispatch) {
        var profile = configureStore_1["default"].getState().profileReducer.form.profile;
        var token = configureStore_1["default"].getState().authReducer.token;
        dispatch({ type: exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_REQUEST });
        BackendFactory_1["default"].getInstance().getServer().then(function (server) {
            server.getPrivateChatRoomId(token, profile._id, contactId, function result(err, res) {
                if (res.code === httpStatusCode_1["default"].success) {
                    var room = JSON.parse(JSON.stringify(res.data));
                    dispatch({ type: exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS, payload: room });
                }
                else {
                    console.warn(err, res);
                    dispatch({ type: exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE, payload: err });
                }
            });
        })["catch"](function (err) {
            dispatch({ type: exports.STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE, payload: err });
        });
    };
}
exports.getPrivateChatRoomId = getPrivateChatRoomId;
