/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 * 
 */

import { BackendFactory } from "../../BackendFactory";
import { withToken, apiHeaders } from "./ServiceUtils";
import InternalStore from "../InternalStore";
const getConfig = () => BackendFactory.getInstance().getApiConfig();
const authReducer = () => InternalStore.authStore;


export function updateMessageReader(message_id: string, room_id: string) {
    return fetch(`${getConfig().message}/updateReader`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ room_id: room_id, message_id: message_id })
    });
}
export function updateMessagesReader(messages_id: Array<string>, room_id: string) {
    return fetch(`${getConfig().message}/updateMessagesReader`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ room_id: room_id, messages: messages_id })
    });
}