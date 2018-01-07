"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const redux_actions_1 = require("redux-actions");
const starter_1 = require("stalk-js/starter");
const chatroomActions = require("../chatroom/chatroomActions");
const ChitChatFactory_1 = require("../../ChitChatFactory");
const getStore = () => ChitChatFactory_1.ChitChatFactory.getInstance().store;
const authReducer = () => ChitChatFactory_1.ChitChatFactory.getInstance().authStore;
exports.STALK_INIT_CHATLOG = "STALK_INIT_CHATLOG";
exports.STALK_GET_CHATSLOG_COMPLETE = "STALK_GET_CHATSLOG_COMPLETE";
exports.STALK_CHATLOG_MAP_CHANGED = "STALK_CHATLOG_MAP_CHANGED";
exports.STALK_CHATLOG_CONTACT_COMPLETE = "STALK_CHATLOG_CONTACT_COMPLETE";
exports.ON_CHATLOG_CHANGE = "ON_CHATLOG_CHANGE";
exports.onChatLogChanged = redux_actions_1.createAction(exports.ON_CHATLOG_CHANGE, payload => payload);
const listenerImp = (newMsg) => {
    let dataManager = starter_1.BackendFactory.getInstance().dataManager;
    if (!dataManager.isMySelf(newMsg.sender)) {
        getStore().dispatch(exports.onChatLogChanged(newMsg));
    }
};
function updateLastAccessTimeEventHandler(newRoomAccess) {
    console.log("updateLastAccessTimeEventHandler", newRoomAccess);
    let chatsLogComp = starter_1.BackendFactory.getInstance().chatLogComp;
    let { _id } = authReducer().user;
    chatsLogComp.getUnreadMessage(_id, newRoomAccess).then(function (unread) {
        chatsLogComp.addUnreadMessage(unread);
        calculateUnreadCount();
        onUnreadMessageMapChanged(unread);
        // chatLogDAL.savePersistedUnreadMsgMap(unread);
    }).catch(err => {
        if (err) {
            console.warn("updateLastAccessTimeEventHandler fail", err);
        }
    });
}
function initChatsLog() {
    let chatsLogComponent = starter_1.BackendFactory.getInstance().createChatlogs();
    chatsLogComponent.onReady = function (rooms) {
        getStore().dispatch(chatroomActions.updateChatRoom(rooms));
        getUnreadMessages();
    };
    chatsLogComponent.getRoomsInfoCompleteEvent = () => {
        let { chatrooms } = getStore().getState().chatroomReducer;
        chatsLogComponent.manageChatLog(chatrooms).then(chatlog => {
            getChatsLog();
        });
    };
    chatsLogComponent.addOnChatListener(listenerImp);
    chatsLogComponent.updatedLastAccessTimeEvent = updateLastAccessTimeEventHandler;
    chatsLogComponent.addNewRoomAccessEvent = function (data) {
        getUnreadMessages();
    };
    getStore().dispatch({ type: exports.STALK_INIT_CHATLOG });
}
exports.initChatsLog = initChatsLog;
function getUnreadMessages() {
    let chatsLogComp = starter_1.BackendFactory.getInstance().chatLogComp;
    let { _id } = authReducer().user;
    let { roomAccess, state } = getStore().getState().chatlogReducer;
    chatsLogComp.getUnreadMessages(_id, roomAccess, function done(err, unreadLogs) {
        if (!!unreadLogs) {
            chatsLogComp.setUnreadMessageMap(unreadLogs);
            calculateUnreadCount();
            getUnreadMessageComplete();
        }
        if (roomAccess.length === 0) {
            getChatsLog();
        }
    });
}
function calculateUnreadCount() {
    let chatsLogComp = starter_1.BackendFactory.getInstance().chatLogComp;
    chatsLogComp.calculateChatsLogCount();
}
function increaseLogsCount(count) {
    let chatsLogComp = starter_1.BackendFactory.getInstance().chatLogComp;
    chatsLogComp.increaseChatsLogCount(count);
}
function decreaseLogsCount(count) {
    let chatsLogComp = starter_1.BackendFactory.getInstance().chatLogComp;
    chatsLogComp.decreaseChatsLogCount(count);
}
function getChatsLogCount() {
    let chatsLogComp = starter_1.BackendFactory.getInstance().chatLogComp;
    return chatsLogComp ? chatsLogComp.getChatsLogCount() : null;
}
exports.getChatsLogCount = getChatsLogCount;
function getUnreadMessageMap() {
    let chatsLogComp = starter_1.BackendFactory.getInstance().chatLogComp;
    return chatsLogComp.getUnreadMessageMap();
}
function getChatsLog() {
    let chatsLogComp = starter_1.BackendFactory.getInstance().chatLogComp;
    let chatsLog = chatsLogComp.getChatsLog();
    getStore().dispatch({
        type: exports.STALK_GET_CHATSLOG_COMPLETE,
        payload: chatsLog
    });
}
function onUnreadMessageMapChanged(unread) {
    return __awaiter(this, void 0, void 0, function* () {
        let chatsLogComp = starter_1.BackendFactory.getInstance().chatLogComp;
        let { chatrooms } = getStore().getState().chatroomReducer;
        try {
            let room = yield chatsLogComp.checkRoomInfo(unread, chatrooms);
            if (room) {
                updateRooms(room);
            }
        }
        catch (ex) {
            console.warn("Have no roomInfo");
        }
        let chatsLog = chatsLogComp.getChatsLog();
        getStore().dispatch({
            type: exports.STALK_CHATLOG_MAP_CHANGED,
            payload: chatsLog
        });
    });
}
function getUnreadMessageComplete() {
    let chatsLogComp = starter_1.BackendFactory.getInstance().chatLogComp;
    let { _id } = authReducer().user;
    let { chatrooms } = getStore().getState().chatroomReducer;
    chatsLogComp.getRoomsInfo(_id, chatrooms);
    // $rootScope.$broadcast('getunreadmessagecomplete', {});
}
const getChatLogContact = (chatlog) => {
    let dataManager = starter_1.BackendFactory.getInstance().dataManager;
    let contacts = chatlog.room.members.filter(value => {
        return !dataManager.isMySelf(value._id);
    });
    return (contacts.length > 0) ? contacts[0]._id : null;
};
function updateRooms(room) {
    return __awaiter(this, void 0, void 0, function* () {
        let { chatrooms } = getStore().getState().chatroomReducer;
        if (Array.isArray(chatrooms) && chatrooms.length > 0) {
            chatrooms.forEach(v => {
                if (v._id === room._id) {
                    v = room;
                }
            });
            let id = chatrooms.indexOf(room);
            if (id < 0) {
                chatrooms.push(room);
            }
        }
        else {
            chatrooms = new Array();
            chatrooms.push(room);
        }
        getStore().dispatch(chatroomActions.updateChatRoom(chatrooms));
    });
}
