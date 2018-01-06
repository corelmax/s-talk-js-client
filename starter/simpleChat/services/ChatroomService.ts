/**
 * Pure fuction service.
 */

import { BackendFactory } from "../../BackendFactory";
import InternalStore from "../InternalStore";
import { withToken, apiHeaders } from "./ServiceUtils";
const getConfig = () => BackendFactory.getInstance().getApiConfig();

export const getRoomInfo = (room_id: string): Promise<any> => {
    return fetch(`${getConfig().chatroom}/roomInfo?room_id=${room_id}`, {
        method: "GET",
        headers: withToken(apiHeaders())(InternalStore.authStore.api_token)
    });
};

export const getUnreadMessage = (room_id: string, user_id: string, lastAccessTime: string): Promise<any> => {
    return fetch(`${getConfig().chatroom}/unreadMessage?room_id=${room_id}&user_id=${user_id}&lastAccessTime=${lastAccessTime}`, {
        method: "GET",
        headers: apiHeaders()
    });
};

export const getOlderMessagesCount = (room_id: string, topEdgeMessageTime: string, queryMessage: boolean) => {
    return fetch(`${getConfig().chatroom}/olderMessagesCount/?message=${queryMessage}&room_id=${room_id}&topEdgeMessageTime=${topEdgeMessageTime}`, {
        method: "GET",
        headers: apiHeaders()
    });
};

export const getNewerMessages = (room_id: string, lastMessageTime: Date) => {
    return fetch(`${getConfig().chatroom}/getChatHistory`, {
        body: JSON.stringify({
            room_id: room_id,
            lastMessageTime: lastMessageTime
        }),
        method: "POST",
        headers: apiHeaders()
    });
};

export const getPrivateChatroom = (ownerId: string, roommateId: string) => {
    return fetch(`${getConfig().chatroom}`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
            ownerId: ownerId,
            roommateId: roommateId
        })
    });
};