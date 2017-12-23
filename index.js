/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th
 */
import { Stalk } from "./lib/browser/ServerImplemented";
import { StalkJS } from "./lib/browser/StalkJS";
import { API } from "./lib/browser/API";
import { StalkEvents } from "./lib/browser/StalkEvents";
export default StalkJS;
export var ServerImp = Stalk.ServerImplemented;
export var ServerParam = Stalk.ServerParam;
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
    stalk_events.stalkEvents = StalkEvents;
    stalk_events.PushEvents = StalkEvents.PushEvents;
    stalk_events.CallingEvents = StalkEvents.CallingEvents;
    stalk_events.ChatEvents = StalkEvents.ChatEvents;
})(stalk_events || (stalk_events = {}));
