"use strict";
/**
 * Pure fuction service.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const BackendFactory_1 = require("../../BackendFactory");
const InternalStore_1 = require("../InternalStore");
const ServiceUtils_1 = require("./ServiceUtils");
const getConfig = () => BackendFactory_1.BackendFactory.getInstance().getApiConfig();
exports.getRoomInfo = (room_id) => {
    return fetch(`${getConfig().chatroom}/roomInfo?room_id=${room_id}`, {
        method: "GET",
        headers: ServiceUtils_1.withToken(ServiceUtils_1.apiHeaders())(InternalStore_1.default.authStore.api_token)
    });
};
exports.getUnreadMessage = (room_id, user_id, lastAccessTime) => {
    return fetch(`${getConfig().chatroom}/unreadMessage?room_id=${room_id}&user_id=${user_id}&lastAccessTime=${lastAccessTime}`, {
        method: "GET",
        headers: ServiceUtils_1.apiHeaders()
    });
};
exports.getOlderMessagesCount = (room_id, topEdgeMessageTime, queryMessage) => {
    return fetch(`${getConfig().chatroom}/olderMessagesCount/?message=${queryMessage}&room_id=${room_id}&topEdgeMessageTime=${topEdgeMessageTime}`, {
        method: "GET",
        headers: ServiceUtils_1.apiHeaders()
    });
};
exports.getNewerMessages = (room_id, lastMessageTime) => {
    return fetch(`${getConfig().chatroom}/getChatHistory`, {
        body: JSON.stringify({
            room_id: room_id,
            lastMessageTime: lastMessageTime
        }),
        method: "POST",
        headers: ServiceUtils_1.apiHeaders()
    });
};
exports.getPrivateChatroom = (ownerId, roommateId) => {
    return fetch(`${getConfig().chatroom}`, {
        method: "POST",
        headers: ServiceUtils_1.apiHeaders(),
        body: JSON.stringify({
            ownerId: ownerId,
            roommateId: roommateId
        })
    });
};
