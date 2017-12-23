/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th
 */
import { StalkJS } from "./lib/browser/StalkJS";
import { API } from "./lib/browser/API";
import * as stalkEvents from "./lib/browser/StalkEvents";
import { Stalk } from "./lib/browser/serverImplemented";
declare module "stalk-js" {
    export import stalkjs = StalkJS;
    export import CallingAPI = API.CallingAPI;
    export import ChatRoomAPI = API.ChatRoomAPI;
    export import GateAPI = API.GateAPI;
    export import LobbyAPI = API.LobbyAPI;
    export import PushAPI = API.PushAPI;
    export import StalkEvents = stalkEvents.StalkEvents;
    export import PushEvents = stalkEvents.PushEvents;
    export import CallingEvents = stalkEvents.CallingEvents;
    export import ChatEvents = stalkEvents.ChatEvents;
}
export declare type ServerImp = Stalk.ServerImplemented;
