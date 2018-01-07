"use strict";
/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const BackendFactory_1 = require("../../BackendFactory");
const ServiceUtils_1 = require("./ServiceUtils");
const InternalStore_1 = require("../InternalStore");
const getConfig = () => BackendFactory_1.BackendFactory.getInstance().getApiConfig();
const authReducer = () => InternalStore_1.default.authStore;
function updateMessageReader(message_id, room_id) {
    return fetch(`${getConfig().message}/updateReader`, {
        method: "POST",
        headers: ServiceUtils_1.apiHeaders(),
        body: JSON.stringify({ room_id: room_id, message_id: message_id })
    });
}
exports.updateMessageReader = updateMessageReader;
function updateMessagesReader(messages_id, room_id) {
    return fetch(`${getConfig().message}/updateMessagesReader`, {
        method: "POST",
        headers: ServiceUtils_1.apiHeaders(),
        body: JSON.stringify({ room_id: room_id, messages: messages_id })
    });
}
exports.updateMessagesReader = updateMessagesReader;
