/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th
 */
import { Stalk } from "./lib/browser/ServerImplemented";
import { StalkJS } from "./lib/browser/StalkJS";
import { API } from "./lib/browser/API";
import * as stalkEvents from "./lib/browser/StalkEvents";
export var stalkjs;
(function (stalkjs) {
    stalkjs.stalkjs = StalkJS;
})(stalkjs || (stalkjs = {}));
export var stalk_core;
(function (stalk_core) {
    stalk_core.ServerImp = Stalk.ServerImplemented;
    stalk_core.ServerParam = Stalk.ServerParam;
})(stalk_core || (stalk_core = {}));
export var stalk_api;
(function (stalk_api) {
    stalk_api.CallingAPI = API.CallingAPI;
    stalk_api.ChatRoomAPI = API.ChatRoomAPI;
    stalk_api.GateAPI = API.GateAPI;
    stalk_api.LobbyAPI = API.LobbyAPI;
    stalk_api.PushAPI = API.PushAPI;
})(stalk_api || (stalk_api = {}));
export var stalk_events;
(function (stalk_events) {
    stalk_events.StalkEvents = stalkEvents.StalkEvents;
    stalk_events.PushEvents = stalkEvents.PushEvents;
    stalk_events.CallingEvents = stalkEvents.CallingEvents;
    stalk_events.ChatEvents = stalkEvents.ChatEvents;
})(stalk_events || (stalk_events = {}));
