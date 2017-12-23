/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th 
 */

import { Stalk } from "./lib/browser/ServerImplemented";
import { StalkJS } from "./lib/browser/StalkJS";
import { API } from "./lib/browser/API";
import * as stalkEvents from "./lib/browser/StalkEvents";

declare module "stalk-js" {
    export = StalkJS;

    export import ServerImp = Stalk.ServerImplemented;
    export import ServerParam = Stalk.ServerParam;
    export import IPomelo = Stalk.IPomelo;
    export import IPomeloResponse = Stalk.IPomeloResponse;
    export import IServer = Stalk.IServer;
    export import IDictionary = Stalk.IDictionary;

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