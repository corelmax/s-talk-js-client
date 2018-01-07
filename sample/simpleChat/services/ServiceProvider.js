"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs/Rx");
const ChitChatFactory_1 = require("../ChitChatFactory");
const chitchatServiceUtils_1 = require("./chitchatServiceUtils");
const getConfig = () => ChitChatFactory_1.ChitChatFactory.getInstance().config;
const authReducer = () => ChitChatFactory_1.ChitChatFactory.getInstance().authStore;
function getLastAccessRoomInfo(user_id) {
    return fetch(`${getConfig().api.user}/lastAccessRoom?user_id=${user_id}`, {
        method: "GET",
        headers: chitchatServiceUtils_1.apiHeaders()
    });
}
exports.getLastAccessRoomInfo = getLastAccessRoomInfo;
function updateLastAccessRoomInfo(user_id, room_id) {
    return Rx.Observable.ajax({
        url: `${getConfig().api.user}/lastAccessRoom`,
        method: "POST",
        headers: chitchatServiceUtils_1.apiHeaders(),
        body: JSON.stringify({
            room_id: room_id,
            user_id: user_id
        })
    });
}
exports.updateLastAccessRoomInfo = updateLastAccessRoomInfo;
function removeLastAccessRoomInfo(user_id, room_id) {
    return Rx.Observable.ajax({
        url: `${getConfig().api.user}/lastAccessRoom`,
        method: "DELETE",
        headers: chitchatServiceUtils_1.apiHeaders(),
        body: JSON.stringify({ room_id: room_id, user_id: user_id })
    });
}
exports.removeLastAccessRoomInfo = removeLastAccessRoomInfo;
