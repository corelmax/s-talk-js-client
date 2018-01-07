/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import * as Rx from "rxjs/Rx";
import { Store } from "redux";
const { ajax } = Rx.Observable;
import { createAction } from "redux-actions";

import { BackendFactory } from "stalk-js/starter";
import { ChatsLogComponent, IUnread, Unread } from "stalk-js/starter";
import { RoomAccessData, StalkAccount } from "../../../shared/stalk";
import { Room } from "../../models/Room";
import ChatLog from "../../models/chatLog";
import * as ServiceProvider from "../../services/ServiceProvider";
import * as chatroomActions from "../chatroom/chatroomActions";

import { ChitChatFactory } from "../../ChitChatFactory";
const getStore = () => ChitChatFactory.getInstance().store as Store<any>;
const authReducer = () => ChitChatFactory.getInstance().authStore;

export const STALK_INIT_CHATLOG = "STALK_INIT_CHATLOG";
export const STALK_GET_CHATSLOG_COMPLETE = "STALK_GET_CHATSLOG_COMPLETE";
export const STALK_CHATLOG_MAP_CHANGED = "STALK_CHATLOG_MAP_CHANGED";
export const STALK_CHATLOG_CONTACT_COMPLETE = "STALK_CHATLOG_CONTACT_COMPLETE";

export const ON_CHATLOG_CHANGE = "ON_CHATLOG_CHANGE";
export const onChatLogChanged = createAction(ON_CHATLOG_CHANGE, payload => payload);
const listenerImp = (newMsg) => {
    let dataManager = BackendFactory.getInstance().dataManager;

    if (!dataManager.isMySelf(newMsg.sender)) {
        getStore().dispatch(onChatLogChanged(newMsg));
    }
};

function updateLastAccessTimeEventHandler(newRoomAccess: RoomAccessData) {
    console.log("updateLastAccessTimeEventHandler", newRoomAccess);

    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
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

export function initChatsLog() {
    let chatsLogComponent = BackendFactory.getInstance().createChatlogs();

    chatsLogComponent.onReady = function (rooms: Array<Room>) {
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

    getStore().dispatch({ type: STALK_INIT_CHATLOG });
}

function getUnreadMessages() {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;

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
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    chatsLogComp.calculateChatsLogCount();
}

function increaseLogsCount(count: number) {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    chatsLogComp.increaseChatsLogCount(count);
}

function decreaseLogsCount(count: number) {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    chatsLogComp.decreaseChatsLogCount(count);
}

export function getChatsLogCount() {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    return chatsLogComp ? chatsLogComp.getChatsLogCount() : null;
}

function getUnreadMessageMap() {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    return chatsLogComp.getUnreadMessageMap();
}

function getChatsLog() {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    let chatsLog = chatsLogComp.getChatsLog();

    getStore().dispatch({
        type: STALK_GET_CHATSLOG_COMPLETE,
        payload: chatsLog
    });
}

async function onUnreadMessageMapChanged(unread: IUnread) {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;

    let { chatrooms }: { chatrooms: Array<Room> } = getStore().getState().chatroomReducer;

    try {
        let room = await chatsLogComp.checkRoomInfo(unread, chatrooms);
        if (room) {
            updateRooms(room);
        }
    } catch (ex) {
        console.warn("Have no roomInfo");
    }

    let chatsLog = chatsLogComp.getChatsLog();
    getStore().dispatch({
        type: STALK_CHATLOG_MAP_CHANGED,
        payload: chatsLog
    });
}

function getUnreadMessageComplete() {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    let { _id } = authReducer().user;
    let { chatrooms } = getStore().getState().chatroomReducer;

    chatsLogComp.getRoomsInfo(_id, chatrooms);

    // $rootScope.$broadcast('getunreadmessagecomplete', {});
}

const getChatLogContact = (chatlog: ChatLog) => {
    let dataManager = BackendFactory.getInstance().dataManager;
    let contacts = chatlog.room.members.filter(value => {
        return !dataManager.isMySelf(value._id);
    });

    return (contacts.length > 0) ? contacts[0]._id : null;
};

async function updateRooms(room) {
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
        chatrooms = new Array<Room>();
        chatrooms.push(room);
    }


    getStore().dispatch(chatroomActions.updateChatRoom(chatrooms));
}