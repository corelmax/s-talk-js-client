/**
 * Pure fuction service.
 */
import { BackendFactory } from "../../BackendFactory";
import InternalStore from "../InternalStore";
import { withToken, apiHeaders } from "./ServiceUtils";
const getConfig = () => BackendFactory.getInstance().getApiConfig();
export const getRoomInfo = (room_id) => {
    return fetch(`${getConfig().chatroom}/roomInfo?room_id=${room_id}`, {
        method: "GET",
        headers: withToken(apiHeaders())(InternalStore.authStore.api_token)
    });
};
export const getUnreadMessage = (room_id, user_id, lastAccessTime) => {
    return fetch(`${getConfig().chatroom}/unreadMessage?room_id=${room_id}&user_id=${user_id}&lastAccessTime=${lastAccessTime}`, {
        method: "GET",
        headers: apiHeaders()
    });
};
export const getOlderMessagesCount = (room_id, topEdgeMessageTime, queryMessage) => {
    return fetch(`${getConfig().chatroom}/olderMessagesCount/?message=${queryMessage}&room_id=${room_id}&topEdgeMessageTime=${topEdgeMessageTime}`, {
        method: "GET",
        headers: apiHeaders()
    });
};
export const getNewerMessages = (room_id, lastMessageTime) => {
    return fetch(`${getConfig().chatroom}/getChatHistory`, {
        body: JSON.stringify({
            room_id: room_id,
            lastMessageTime: lastMessageTime
        }),
        method: "POST",
        headers: apiHeaders()
    });
};
export const getPrivateChatroom = (ownerId, roommateId) => {
    return fetch(`${getConfig().chatroom}`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
            ownerId: ownerId,
            roommateId: roommateId
        })
    });
};
