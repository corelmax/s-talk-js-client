/**
 * Pure fuction service.
 */
import { BackendFactory } from "../../BackendFactory";
import InternalStore from "../InternalStore";
import { withToken, apiHeaders } from "./ServiceUtils";
var getConfig = function () { return BackendFactory.getInstance().getApiConfig(); };
export var getRoomInfo = function (room_id) {
    return fetch(getConfig().chatroom + "/roomInfo?room_id=" + room_id, {
        method: "GET",
        headers: withToken(apiHeaders())(InternalStore.authStore.api_token)
    });
};
export var getUnreadMessage = function (room_id, user_id, lastAccessTime) {
    return fetch(getConfig().chatroom + "/unreadMessage?room_id=" + room_id + "&user_id=" + user_id + "&lastAccessTime=" + lastAccessTime, {
        method: "GET",
        headers: apiHeaders()
    });
};
export var getOlderMessagesCount = function (room_id, topEdgeMessageTime, queryMessage) {
    return fetch(getConfig().chatroom + "/olderMessagesCount/?message=" + queryMessage + "&room_id=" + room_id + "&topEdgeMessageTime=" + topEdgeMessageTime, {
        method: "GET",
        headers: apiHeaders()
    });
};
export var getNewerMessages = function (room_id, lastMessageTime) {
    return fetch(getConfig().chatroom + "/getChatHistory", {
        body: JSON.stringify({
            room_id: room_id,
            lastMessageTime: lastMessageTime
        }),
        method: "POST",
        headers: apiHeaders()
    });
};
export var getPrivateChatroom = function (ownerId, roommateId) {
    return fetch("" + getConfig().chatroom, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
            ownerId: ownerId,
            roommateId: roommateId
        })
    });
};
