/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th 
 */

import { Stalk } from "./lib/browser/ServerImplement";
import { StalkJS } from "./lib/browser/StalkJS";
import { API } from "./lib/browser/API";
import * as StalkEvents from "./lib/browser/StalkEvents";

export { ServerParam, IPomelo, IPomeloResponse, IServer } from "./lib/utils/PomeloUtils";
export import stalkjs = StalkJS;
/**
 * Core server implementation.
 */
export import ServerImp = Stalk.ServerImplemented;
// export import ServerParam = ServerParam;
// export import IPomelo = IPomelo;
// export import IPomeloResponse = IPomeloResponse;
// export import IServer = IServer;
export import IDictionary = Stalk.IDictionary;

/**
 * All events.
 */
export import stalkEvents = StalkEvents.StalkEvents;
export import PushEvents = StalkEvents.PushEvents;
export import ChatEvents = StalkEvents.ChatEvents;
export import CallingEvents = StalkEvents.CallingEvents;
export import DataEvent = StalkEvents.DataEvent;

/**
 * APIs interface implementation.
 */
export import CallingAPI = API.CallingAPI;
export import ChatRoomAPI = API.ChatRoomAPI;
export import GateAPI = API.GateAPI;
export import LobbyAPI = API.LobbyAPI;
export import PushAPI = API.PushAPI;