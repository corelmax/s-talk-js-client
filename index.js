"use strict";
/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ServerImplement_1 = require("./lib/browser/ServerImplement");
const StalkJS_1 = require("./lib/browser/StalkJS");
const API_1 = require("./lib/browser/API");
const StalkEvents = require("./lib/browser/StalkEvents");
var PomeloUtils_1 = require("./lib/utils/PomeloUtils");
exports.ServerParam = PomeloUtils_1.ServerParam;
var index_1 = require("./lib/utils/index");
exports.HttpStatusCode = index_1.HttpStatusCode;
exports.stalkjs = StalkJS_1.StalkJS;
/**
 * Core server implementation.
 */
exports.ServerImp = ServerImplement_1.Stalk.ServerImplemented;
/**
 * All events.
 */
exports.stalkEvents = StalkEvents.StalkEvents;
exports.PushEvents = StalkEvents.PushEvents;
exports.ChatEvents = StalkEvents.ChatEvents;
exports.CallingEvents = StalkEvents.CallingEvents;
/**
 * APIs interface implementation.
 */
exports.CallingAPI = API_1.API.CallingAPI;
exports.ChatRoomAPI = API_1.API.ChatRoomAPI;
exports.GateAPI = API_1.API.GateAPI;
exports.LobbyAPI = API_1.API.LobbyAPI;
exports.PushAPI = API_1.API.PushAPI;
