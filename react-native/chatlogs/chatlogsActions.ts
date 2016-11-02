/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import BackendFactory from "../../chats/BackendFactory";
import DataManager from "../../chats/dataManager";
import ChatsLogComponent, { ChatLogMap, IUnread, Unread } from "../../chats/chatslogComponent";
import StalkImp, { IDictionary } from "../../libs/stalk/serverImplemented";

import Store from "../configureStore";

const dataManager = DataManager.getInstance();
const serverImp = BackendFactory.getInstance().getServer();

export const INIT_CHATSLOG = 'INIT_CHATSLOG';
export const GET_CHATSLOG_COMPLETE = 'GET_CHATSLOG_COMPLETE';
export const UNREAD_MAP_CHANGED = 'UNREAD_MAP_CHANGED';


const listenerImp = (newMsg) => {
    let chatsLogComp: ChatsLogComponent = Store.getState().stalkReducer.chatslogComponent;
    if (!dataManager.isMySelf(newMsg.sender)) {
        chatsLogComp.increaseChatsLogCount(1);
        console.warn("room to add: ", JSON.stringify(chatsLogComp.getUnreadItem(newMsg.rid)));

        let unread: IUnread = new Unread();
        unread.message = newMsg;
        unread.rid = newMsg.rid;
        let count = (!!chatsLogComp.getUnreadItem(newMsg.rid)) ? chatsLogComp.getUnreadItem(newMsg.rid).count : 0;
        count++;
        unread.count = count;
        chatsLogComp.addUnreadMessage(unread);

        onUnreadMessageMapChanged(unread);
        //             chatLogDAL.savePersistedUnreadMsgMap(unread);
    }
};

export function initChatsLog() {
    if (!Store.getState().stalkReducer.isInit) {
        let chatsLogComponent = new ChatsLogComponent();

        dataManager.contactsProfileChanged = (contact) => {
            chatsLogComponent.getRoomsInfo();
        }
        chatsLogComponent.onReady = function () {
            getUnreadMessages();
            chatsLogComponent.onReady = null;
        };
        chatsLogComponent.getRoomsInfoCompleteEvent = () => {
            getChatsLog();
        }
        chatsLogComponent.addOnChatListener(listenerImp);
        chatsLogComponent.updatedLastAccessTimeEvent = updateLastAccessTimeEventHandler;
        chatsLogComponent.addNewRoomAccessEvent = function (data) {
            getUnreadMessages();
        }

        chatsLogComponent.onEditedGroupMember = function (newgroup) {
            console.log('onEditedGroupMember: ', JSON.stringify(newgroup));
            // $rootScope.$broadcast('onEditedGroupMember', []);
        }

        let msg: IDictionary = {};
        msg["token"] = Store.getState().authReducer.token;
        serverImp.getLastAccessRoomsInfo(msg, function (err, res) {
            console.log("getLastAccessRoomsInfo:", JSON.stringify(res));
        });

        Store.dispatch({
            type: INIT_CHATSLOG, payload: chatsLogComponent
        });
    }
}

function updateLastAccessTimeEventHandler(newRoomAccess) {
    let chatsLogComp: ChatsLogComponent = Store.getState().stalkReducer.chatslogComponent;
    let token = Store.getState().authReducer.token;
    chatsLogComp.getUnreadMessage(token, newRoomAccess.roomAccess[0], function (err, unread) {
        if (!!unread) {
            chatsLogComp.addUnreadMessage(unread);

            calculateUnreadCount();

            onUnreadMessageMapChanged(unread);
            //chatLogDAL.savePersistedUnreadMsgMap(unread);
        }
    });
}

function getUnreadMessages() {
    let chatsLogComp: ChatsLogComponent = Store.getState().stalkReducer.chatslogComponent;
    let token = Store.getState().authReducer.token;
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
    let chatsLogComp: ChatsLogComponent = Store.getState().stalkReducer.chatslogComponent;
    chatsLogComp.calculateChatsLogCount();
}

function increaseLogsCount(count: number) {
    let chatsLogComp: ChatsLogComponent = Store.getState().stalkReducer.chatslogComponent;
    chatsLogComp.increaseChatsLogCount(count);
}

function decreaseLogsCount(count: number) {
    let chatsLogComp: ChatsLogComponent = Store.getState().stalkReducer.chatslogComponent;
    chatsLogComp.decreaseChatsLogCount(count);
}

function getChatsLogCount() {
    let chatsLogComp: ChatsLogComponent = Store.getState().stalkReducer.chatslogComponent;
    return chatsLogComp.getChatsLogCount();
}

function getUnreadMessageMap() {
    let chatsLogComp: ChatsLogComponent = Store.getState().stalkReducer.chatslogComponent;
    return chatsLogComp.getUnreadMessageMap();
}

function getChatsLog() {
    let chatsLogComp: ChatsLogComponent = Store.getState().stalkReducer.chatslogComponent;
    let chatsLog = chatsLogComp.getChatsLog();

    Store.dispatch({
        type: GET_CHATSLOG_COMPLETE,
        payload: chatsLog
    });
}

function onUnreadMessageMapChanged(unread: IUnread) {
    console.log('UnreadMessageMapChanged: ', JSON.stringify(unread));

    let chatsLogComp: ChatsLogComponent = Store.getState().stalkReducer.chatslogComponent;
    chatsLogComp.checkRoomInfo(unread).then(function () {
        let chatsLog = chatsLogComp.getChatsLog();
        Store.dispatch({
            type: UNREAD_MAP_CHANGED,
            payload: chatsLog
        });
    }).catch(function () {
        console.warn("Cannot get roomInfo of ", unread.rid);
    });
}

function getUnreadMessageComplete() {
    let chatsLogComp: ChatsLogComponent = Store.getState().stalkReducer.chatslogComponent;
    chatsLogComp.getRoomsInfo();

    // $rootScope.$broadcast('getunreadmessagecomplete', {});
}