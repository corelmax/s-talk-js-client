/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 */
import { BackendFactory } from "../../BackendFactory";
import { apiHeaders } from "./ServiceUtils";
import InternalStore from "../InternalStore";
var getConfig = function () { return BackendFactory.getInstance().getApiConfig(); };
var authReducer = function () { return InternalStore.authStore; };
export function updateMessageReader(message_id, room_id) {
    return fetch(getConfig().message + "/updateReader", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ room_id: room_id, message_id: message_id })
    });
}
export function updateMessagesReader(messages_id, room_id) {
    return fetch(getConfig().message + "/updateMessagesReader", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ room_id: room_id, messages: messages_id })
    });
}
