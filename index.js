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
    stalkjs.ServerImp = Stalk.ServerImplemented;
    stalkjs.ServerParam = Stalk.ServerParam;
    stalkjs.CallingAPI = API.CallingAPI;
    stalkjs.ChatRoomAPI = API.ChatRoomAPI;
    stalkjs.GateAPI = API.GateAPI;
    stalkjs.LobbyAPI = API.LobbyAPI;
    stalkjs.PushAPI = API.PushAPI;
    stalkjs.StalkEvents = stalkEvents.StalkEvents;
    stalkjs.PushEvents = stalkEvents.PushEvents;
    stalkjs.CallingEvents = stalkEvents.CallingEvents;
    stalkjs.ChatEvents = stalkEvents.ChatEvents;
})(stalkjs || (stalkjs = {}));
