import * as Rx from "rxjs";
var ajax = Rx.Observable.ajax;
import { ChitChatFactory } from "../ChitChatFactory";
import { apiHeaders, withToken } from "./chitchatServiceUtils";
var getConfig = function () { return ChitChatFactory.getInstance().config; };
var authReducer = function () { return ChitChatFactory.getInstance().authStore; };
export function addMember(room_id, member) {
    return ajax({
        method: "POST",
        url: getConfig().api.group + "/addMember/" + room_id,
        body: JSON.stringify({ member: member }),
        headers: apiHeaders()
    });
}
export function removeMember(room_id, member_id) {
    return ajax({
        method: "POST",
        url: getConfig().api.group + "/removeMember/" + room_id,
        body: JSON.stringify({ member_id: member_id }),
        headers: withToken(apiHeaders())(authReducer().chitchat_token)
    });
}
