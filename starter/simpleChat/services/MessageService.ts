import * as Rx from "rxjs";

import { ChitChatFactory } from "../ChitChatFactory";
import { withToken, chitchat_headers } from "./chitchatServiceUtils";
const getConfig = () => ChitChatFactory.getInstance().config;
const authReducer = () => ChitChatFactory.getInstance().authStore;

const { ajax } = Rx.Observable;

export function updateMessageReader(message_id: string, room_id: string) {
    return fetch(`${getConfig().api.message}/updateReader`, {
        method: "POST",
        headers: chitchat_headers(),
        body: JSON.stringify({ room_id: room_id, message_id: message_id })
    });
}
export function updateMessagesReader(messages_id: Array<string>, room_id: string) {
    return fetch(`${getConfig().api.message}/updateMessagesReader`, {
        method: "POST",
        headers: chitchat_headers(),
        body: JSON.stringify({ room_id: room_id, messages: messages_id })
    });
}