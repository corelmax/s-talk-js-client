/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th 
 */

export * from "./lib/browser/serverImplemented";
export * from "./lib/browser/StalkEvents";
export * from "./lib/browser/API";
// export * from "./lib/browser/StalkJS";

import { StalkJS } from "./lib/browser/StalkJS";
import { API } from "./lib/browser/API";

declare module "stalk-js" {
    export import stalkjs = StalkJS;
    export import CallingAPI = API.CallingAPI;
    export import ChatRoomAPI = API.ChatRoomAPI;
    export import GateAPI = API.GateAPI;
    export import LobbyAPI = API.LobbyAPI;
    export import PushAPI = API.PushAPI;
}