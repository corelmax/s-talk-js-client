import * as Rx from "rxjs";
const { ajax } = Rx.Observable;
import { ChitChatFactory } from "../ChitChatFactory";
import { chitchat_headers, withToken } from "./chitchatServiceUtils";
const getConfig = () => ChitChatFactory.getInstance().config;
const authReducer = () => ChitChatFactory.getInstance().authStore;
export function addMember(room_id, member) {
    return ajax({
        method: "POST",
        url: `${getConfig().api.group}/addMember/${room_id}`,
        body: JSON.stringify({ member: member }),
        headers: chitchat_headers()
    });
}
export function removeMember(room_id, member_id) {
    return ajax({
        method: "POST",
        url: `${getConfig().api.group}/removeMember/${room_id}`,
        body: JSON.stringify({ member_id: member_id }),
        headers: withToken(chitchat_headers())(authReducer().chitchat_token)
    });
}
