/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
const BackendFactory_1 = require("../../chats/BackendFactory");
const dataManager_1 = require("../../chats/dataManager");
const chatslogComponent_1 = require("../../chats/chatslogComponent");
const configureStore_1 = require("../configureStore");
const dataManager = dataManager_1.default.getInstance();
const serverImp = BackendFactory_1.default.getInstance().getServer();
exports.INIT_CHATSLOG = 'INIT_CHATSLOG';
exports.GET_CHATSLOG_COMPLETE = 'GET_CHATSLOG_COMPLETE';
exports.UNREAD_MAP_CHANGED = 'UNREAD_MAP_CHANGED';
const listenerImp = (newMsg) => {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    if (!dataManager.isMySelf(newMsg.sender)) {
        chatsLogComp.increaseChatsLogCount(1);
        console.warn("room to add: ", JSON.stringify(chatsLogComp.getUnreadItem(newMsg.rid)));
        let unread = new chatslogComponent_1.Unread();
        unread.message = newMsg;
        unread.rid = newMsg.rid;
        let count = (!!chatsLogComp.getUnreadItem(newMsg.rid)) ? chatsLogComp.getUnreadItem(newMsg.rid).count : 0;
        count++;
        unread.count = count;
        chatsLogComp.addUnreadMessage(unread);
        onUnreadMessageMapChanged(unread);
    }
};
function initChatsLog() {
    if (!configureStore_1.default.getState().stalkReducer.isInit) {
        let chatsLogComponent = new chatslogComponent_1.default();
        dataManager.contactsProfileChanged = (contact) => {
            chatsLogComponent.getRoomsInfo();
        };
        chatsLogComponent.onReady = function () {
            getUnreadMessages();
            chatsLogComponent.onReady = null;
        };
        chatsLogComponent.getRoomsInfoCompleteEvent = () => {
            getChatsLog();
        };
        chatsLogComponent.addOnChatListener(listenerImp);
        chatsLogComponent.updatedLastAccessTimeEvent = updateLastAccessTimeEventHandler;
        chatsLogComponent.addNewRoomAccessEvent = function (data) {
            getUnreadMessages();
        };
        chatsLogComponent.onEditedGroupMember = function (newgroup) {
            console.log('onEditedGroupMember: ', JSON.stringify(newgroup));
            // $rootScope.$broadcast('onEditedGroupMember', []);
        };
        let msg = {};
        msg["token"] = configureStore_1.default.getState().authReducer.token;
        serverImp.getLastAccessRoomsInfo(msg, function (err, res) {
            console.log("getLastAccessRoomsInfo:", JSON.stringify(res));
        });
        configureStore_1.default.dispatch({
            type: exports.INIT_CHATSLOG, payload: chatsLogComponent
        });
    }
}
exports.initChatsLog = initChatsLog;
function updateLastAccessTimeEventHandler(newRoomAccess) {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    let token = configureStore_1.default.getState().authReducer.token;
    chatsLogComp.getUnreadMessage(token, newRoomAccess.roomAccess[0], function (err, unread) {
        if (!!unread) {
            chatsLogComp.addUnreadMessage(unread);
            calculateUnreadCount();
            onUnreadMessageMapChanged(unread);
        }
    });
}
function getUnreadMessages() {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    let token = configureStore_1.default.getState().authReducer.token;
    chatsLogComp.getUnreadMessages(token, dataManager.getRoomAccess(), function done(err, unreadLogs) {
        if (!!unreadLogs) {
            unreadLogs.map(function element(unread) {
                chatsLogComp.addUnreadMessage(unread);
            });
            calculateUnreadCount();
        }
        getUnreadMessageComplete();
    });
}
function calculateUnreadCount() {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.calculateChatsLogCount();
}
function increaseLogsCount(count) {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.increaseChatsLogCount(count);
}
function decreaseLogsCount(count) {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.decreaseChatsLogCount(count);
}
function getChatsLogCount() {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    return chatsLogComp.getChatsLogCount();
}
function getUnreadMessageMap() {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    return chatsLogComp.getUnreadMessageMap();
}
function getChatsLog() {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    let chatsLog = chatsLogComp.getChatsLog();
    configureStore_1.default.dispatch({
        type: exports.GET_CHATSLOG_COMPLETE,
        payload: chatsLog
    });
}
function onUnreadMessageMapChanged(unread) {
    console.log('UnreadMessageMapChanged: ', JSON.stringify(unread));
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.checkRoomInfo(unread).then(function () {
        let chatsLog = chatsLogComp.getChatsLog();
        configureStore_1.default.dispatch({
            type: exports.UNREAD_MAP_CHANGED,
            payload: chatsLog
        });
    }).catch(function () {
        console.warn("Cannot get roomInfo of ", unread.rid);
    });
}
function getUnreadMessageComplete() {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.getRoomsInfo();
    // $rootScope.$broadcast('getunreadmessagecomplete', {});
}
