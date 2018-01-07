"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
const Rx = require("rxjs/Rx");
const redux_actions_1 = require("redux-actions");
const { ajax, fromPromise } = Rx.Observable;
const ChatRoomComponent_1 = require("../../ChatRoomComponent");
const ChitChatFactory_1 = require("../../ChitChatFactory");
const chatroomActions_1 = require("./chatroomActions");
const chitchatServiceUtils_1 = require("../../utils/chitchatServiceUtils");
const chatroomService = require("../../services/chatroomService");
const MessageService_1 = require("../../services/MessageService");
const config_1 = require("../../../../../configs/config");
const getConfig = () => ChitChatFactory_1.ChitChatFactory.getInstance().config;
const getStore = () => ChitChatFactory_1.ChitChatFactory.getInstance().store;
const authReducer = () => ChitChatFactory_1.ChitChatFactory.getInstance().authStore;
exports.FETCH_PRIVATE_CHATROOM = "FETCH_PRIVATE_CHATROOM";
exports.FETCH_PRIVATE_CHATROOM_FAILURE = "FETCH_PRIVATE_CHATROOM_FAILURE";
exports.FETCH_PRIVATE_CHATROOM_SUCCESS = "FETCH_PRIVATE_CHATROOM_SUCCESS";
exports.FETCH_PRIVATE_CHATROOM_CANCELLED = "FETCH_PRIVATE_CHATROOM_CANCELLED";
exports.fetchPrivateChatRoom = (ownerId, roommateId) => ({ type: exports.FETCH_PRIVATE_CHATROOM, payload: { ownerId, roommateId } });
const fetchPrivateChatRoomSuccess = (payload) => ({ type: exports.FETCH_PRIVATE_CHATROOM_SUCCESS, payload });
const cancelFetchPrivateChatRoom = () => ({ type: exports.FETCH_PRIVATE_CHATROOM_CANCELLED });
const fetchPrivateChatRoomFailure = payload => ({ type: exports.FETCH_PRIVATE_CHATROOM_FAILURE, payload });
exports.getPrivateChatRoom_Epic = action$ => action$.ofType(exports.FETCH_PRIVATE_CHATROOM)
    .mergeMap(action => fromPromise(chatroomService.getPrivateChatroom(action.payload.ownerId, action.payload.roommateId)))
    .mergeMap(response => fromPromise(response.json()))
    .map(json => {
    if (json.success) {
        return fetchPrivateChatRoomSuccess(json.result[0]);
    }
    else {
        return fetchPrivateChatRoomFailure(json.message);
    }
})._do(x => {
    if (x.type === exports.FETCH_PRIVATE_CHATROOM_FAILURE) {
        console.warn("Need to create private chat room!");
    }
})
    .takeUntil(action$.ofType(exports.FETCH_PRIVATE_CHATROOM_CANCELLED))
    .catch(error => Rx.Observable.of(fetchPrivateChatRoomFailure(error.message)));
exports.CREATE_PRIVATE_CHATROOM = "CREATE_PRIVATE_CHATROOM";
exports.CREATE_PRIVATE_CHATROOM_SUCCESS = "CREATE_PRIVATE_CHATROOM_SUCCESS";
exports.CREATE_PRIVATE_CHATROOM_CANCELLED = "CREATE_PRIVATE_CHATROOM_CANCELLED";
exports.CREATE_PRIVATE_CHATROOM_FAILURE = "CREATE_PRIVATE_CHATROOM_FAILURE";
exports.createPrivateChatRoom = (owner, roommate) => ({ type: exports.CREATE_PRIVATE_CHATROOM, payload: { owner, roommate } });
const createPrivateChatRoomSuccess = (payload) => ({ type: exports.CREATE_PRIVATE_CHATROOM_SUCCESS, payload });
const createPrivateRoomCancelled = () => ({ type: exports.CREATE_PRIVATE_CHATROOM_CANCELLED });
const createPrivateChatRoomFailure = (payload) => ({ type: exports.CREATE_PRIVATE_CHATROOM_FAILURE, payload });
exports.createPrivateChatRoomEpic = action$ => {
    return action$.ofType(exports.CREATE_PRIVATE_CHATROOM)
        .mergeMap(action => ajax({
        method: "POST",
        url: `${getConfig().api.api}/chatroom/private_chat/create`,
        body: action.payload,
        headers: chitchatServiceUtils_1.chitchat_headers()
        // headers: {
        //     "Content-Type": "application/json",
        //     "x-access-token": authReducer().chitchat_token
        // }
    }))
        .map(json => createPrivateChatRoomSuccess(json.response))
        .takeUntil(action$.ofType(exports.CREATE_PRIVATE_CHATROOM_CANCELLED))
        .catch(error => Rx.Observable.of(createPrivateChatRoomFailure(error.xhr.response)));
};
exports.GET_MY_ROOM = "GET_MY_ROOM";
exports.GET_MY_ROOM_SUCCESS = "GET_MY_ROOM_SUCCESS";
exports.GET_MY_ROOM_FAILURE = "GET_MY_ROOM_FAILURE";
exports.getMyRoom = redux_actions_1.createAction(exports.GET_MY_ROOM, (user_id, username, avatar) => ({ user_id, username, avatar }));
exports.getMyRoomSuccess = redux_actions_1.createAction(exports.GET_MY_ROOM_SUCCESS, payload => payload);
exports.getMyRoomFailure = redux_actions_1.createAction(exports.GET_MY_ROOM_FAILURE, error => error);
exports.getMyRoomEpic = action$ => {
    return action$.ofType(exports.GET_MY_ROOM)
        .mergeMap(action => ajax({
        method: "GET",
        url: `${getConfig().api.chatroom}/myroom?user_id=${action.payload.user_id}&username=${action.payload.username}&avatar=${action.payload.avatar}`,
        headers: chitchatServiceUtils_1.chitchat_headers()
    }))
        .map(json => exports.getMyRoomSuccess(json.response.result[0]))
        .catch(error => Rx.Observable.of(exports.getMyRoomFailure(error)));
};
const GET_PERSISTEND_MESSAGE = "GET_PERSISTEND_MESSAGE";
const GET_PERSISTEND_MESSAGE_CANCELLED = "GET_PERSISTEND_MESSAGE_CANCELLED";
exports.GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
const GET_PERSISTEND_MESSAGE_FAILURE = "GET_PERSISTEND_MESSAGE_FAILURE";
exports.getPersistendMessage = (room_id) => __awaiter(this, void 0, void 0, function* () {
    getStore().dispatch({ type: GET_PERSISTEND_MESSAGE, payload: room_id });
    try {
        let result = yield ChatRoomComponent_1.ChatRoomComponent.getInstance().getPersistentMessage(room_id);
        getStore().dispatch(getPersistendMessage_success(result));
        getStore().dispatch(chatroomActions_1.checkOlderMessages());
        getStore().dispatch(chatroomActions_1.getNewerMessageFromNet());
    }
    catch (ex) {
        getStore().dispatch(getPersistendMessage_failure(ex.message));
    }
});
const getPersistendMessage_cancel = () => ({ type: GET_PERSISTEND_MESSAGE_CANCELLED });
const getPersistendMessage_success = (payload) => ({ type: exports.GET_PERSISTEND_MESSAGE_SUCCESS, payload });
const getPersistendMessage_failure = (error) => ({ type: GET_PERSISTEND_MESSAGE_FAILURE, payload: error });
exports.UPDATE_MESSAGES_READ = "UPDATE_MESSAGES_READ";
exports.UPDATE_MESSAGES_READ_SUCCESS = "UPDATE_MESSAGES_READ_SUCCESS";
exports.UPDATE_MESSAGES_READ_FAILUER = "UPDATE_MESSAGES_READ_FAILURE";
exports.updateMessagesRead = redux_actions_1.createAction(exports.UPDATE_MESSAGES_READ, (messages, room_id) => ({ messages, room_id }));
exports.updateMessagesRead_Success = redux_actions_1.createAction(exports.UPDATE_MESSAGES_READ_SUCCESS, payload => payload);
exports.updateMessagesRead_Failure = redux_actions_1.createAction(exports.UPDATE_MESSAGES_READ_FAILUER, payload => payload);
exports.updateMessagesRead_Epic = (action$) => {
    return action$.ofType(exports.UPDATE_MESSAGES_READ)
        .mergeMap((action) => {
        let messages = action.payload.messages;
        let updates = messages.map((value) => {
            if (value.sender !== authReducer().user._id) {
                return value._id;
            }
        });
        return MessageService_1.updateMessagesReader(updates, action.payload.room_id);
    })
        .mergeMap(response => response.json())
        .map((json) => {
        if (json.success) {
            return exports.updateMessagesRead_Success(json);
        }
        else {
            return exports.updateMessagesRead_Failure(json.message);
        }
    })
        .catch(error => Rx.Observable.of(exports.updateMessagesRead_Failure(error)));
};
exports.CHATROOM_UPLOAD_FILE = "CHATROOM_UPLOAD_FILE";
exports.CHATROOM_UPLOAD_FILE_SUCCESS = "CHATROOM_UPLOAD_FILE_SUCCESS";
exports.CHATROOM_UPLOAD_FILE_FAILURE = "CHATROOM_UPLOAD_FILE_FAILURE";
exports.CHATROOM_UPLOAD_FILE_CANCELLED = "CHATROOM_UPLOAD_FILE_CANCELLED";
exports.uploadFile = (progressEvent, file) => ({ type: exports.CHATROOM_UPLOAD_FILE, payload: { data: progressEvent, file: file } });
const uploadFileSuccess = (result) => {
    let payload = null;
    if (!!result.data) {
        payload = { path: `${config_1.default.SS_REST.host}${result.data.image}` };
    }
    return ({ type: exports.CHATROOM_UPLOAD_FILE_SUCCESS, payload: payload });
};
const uploadFileFailure = (error) => ({ type: exports.CHATROOM_UPLOAD_FILE_FAILURE, payload: error });
exports.uploadFileCanceled = () => ({ type: exports.CHATROOM_UPLOAD_FILE_CANCELLED });
exports.uploadFileEpic = action$ => (action$.ofType(exports.CHATROOM_UPLOAD_FILE)
    .mergeMap(action => {
    let body = new FormData();
    body.append("file", action.payload.file);
    return ajax({
        method: "POST",
        url: `${config_1.default.SS_REST.uploadChatFile}`,
        body: body,
        headers: {}
    });
})
    .map(json => uploadFileSuccess(json.response))
    .takeUntil(action$.ofType(exports.CHATROOM_UPLOAD_FILE_CANCELLED))
    .catch(error => Rx.Observable.of(uploadFileFailure(error.xhr.response))));
