import * as Rx from "rxjs";
const { ajax } = Rx.Observable;

import { ChitChatFactory } from "../ChitChatFactory";
import { apiHeaders, withToken } from "./chitchatServiceUtils";
const getConfig = () => ChitChatFactory.getInstance().config;
const authReducer = () => ChitChatFactory.getInstance().authStore;

export function addMember(room_id: string, member: any) {
    return ajax({
        method: "POST",
        url: `${getConfig().api.group}/addMember/${room_id}`,
        body: JSON.stringify({ member: member }),
        headers: apiHeaders()
    });
}

export function removeMember(room_id: string, member_id: string) {
    return ajax({
        method: "POST",
        url: `${getConfig().api.group}/removeMember/${room_id}`,
        body: JSON.stringify({ member_id: member_id }),
        headers: withToken(apiHeaders())(authReducer().chitchat_token)
    });
}