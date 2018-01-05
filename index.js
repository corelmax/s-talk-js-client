/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th
 */
import { Stalk } from "./lib/browser/ServerImplement";
import { StalkJS } from "./lib/browser/StalkJS";
import { API } from "./lib/browser/API";
import * as StalkEvents from "./lib/browser/StalkEvents";
export { ServerParam } from "./lib/utils/PomeloUtils";
export var stalkjs = StalkJS;
/**
 * Core server implementation.
 */
export var ServerImp = Stalk.ServerImplemented;
/**
 * All events.
 */
export var stalkEvents = StalkEvents.StalkEvents;
export var PushEvents = StalkEvents.PushEvents;
export var ChatEvents = StalkEvents.ChatEvents;
export var CallingEvents = StalkEvents.CallingEvents;
/**
 * APIs interface implementation.
 */
export var CallingAPI = API.CallingAPI;
export var ChatRoomAPI = API.ChatRoomAPI;
export var GateAPI = API.GateAPI;
export var LobbyAPI = API.LobbyAPI;
export var PushAPI = API.PushAPI;
