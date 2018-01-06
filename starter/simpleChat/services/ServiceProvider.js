import * as Rx from "rxjs/Rx";
import { ChitChatFactory } from "../ChitChatFactory";
import { chitchat_headers } from "./chitchatServiceUtils";
const getConfig = () => ChitChatFactory.getInstance().config;
const authReducer = () => ChitChatFactory.getInstance().authStore;
export function getLastAccessRoomInfo(user_id) {
    return fetch(`${getConfig().api.user}/lastAccessRoom?user_id=${user_id}`, {
        method: "GET",
        headers: chitchat_headers()
    });
}
export function updateLastAccessRoomInfo(user_id, room_id) {
    return Rx.Observable.ajax({
        url: `${getConfig().api.user}/lastAccessRoom`,
        method: "POST",
        headers: chitchat_headers(),
        body: JSON.stringify({
            room_id: room_id,
            user_id: user_id
        })
    });
}
export function removeLastAccessRoomInfo(user_id, room_id) {
    return Rx.Observable.ajax({
        url: `${getConfig().api.user}/lastAccessRoom`,
        method: "DELETE",
        headers: chitchat_headers(),
        body: JSON.stringify({ room_id: room_id, user_id: user_id })
    });
}
