import * as Rx from "rxjs/Rx";

import { ChitChatFactory } from "../ChitChatFactory";
import { withToken, apiHeaders } from "./chitchatServiceUtils";
const getConfig = () => ChitChatFactory.getInstance().config;
const authReducer = () => ChitChatFactory.getInstance().authStore;


export function getLastAccessRoomInfo(user_id: string) {
    return fetch(`${getConfig().api.user}/lastAccessRoom?user_id=${user_id}`, {
        method: "GET",
        headers: apiHeaders()
    });
}

export function updateLastAccessRoomInfo(user_id: string, room_id: string) {
    return Rx.Observable.ajax({
        url: `${getConfig().api.user}/lastAccessRoom`,
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
            room_id: room_id,
            user_id: user_id
        })
    });
}

export function removeLastAccessRoomInfo(user_id: string, room_id: string) {
    return Rx.Observable.ajax({
        url: `${getConfig().api.user}/lastAccessRoom`,
        method: "DELETE",
        headers: apiHeaders(),
        body: JSON.stringify({ room_id: room_id, user_id: user_id })
    });
}

