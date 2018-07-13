import * as gateAPI from "./api/GateAPI";
import * as lobbyAPI from "./api/LobbyAPI";
import * as chatroomAPI from "./api/ChatRoomAPI";
import * as pushAPI from "./api/PushAPI";
import * as callingAPI from "./api/CallingAPI";
export var API;
(function (API) {
    API.GateAPI = gateAPI;
    API.LobbyAPI = lobbyAPI;
    API.ChatRoomAPI = chatroomAPI;
    API.PushAPI = pushAPI;
    API.CallingAPI = callingAPI;
})(API || (API = {}));
