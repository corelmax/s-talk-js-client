import { ServerImplemented, IDictionary, ServerParam } from "./lib/browser/serverImplemented";
import { ChatRoomApiProvider } from "./lib/browser/chatRoomApiProvider";
import { ServerEventListener } from "./lib/browser/serverEventListener";

import { HttpStatusCode } from "./lib/utils/httpStatusCode";
import { TokenDecode } from "./lib/utils/tokenDecode";

let Stalk = Object.create(null);
Stalk.Stalk = ServerImplemented; // require("./lib/browser/serverImplemented");
Stalk.ChatRoom = ChatRoomApiProvider; // require("./lib/browser/chatRoomApiProvider");
Stalk.Events = ServerEventListener;

Stalk.Utils = Object.create(null);
Stalk.Utils.token = TokenDecode;
Stalk.Utils.statusCode = HttpStatusCode;

export type ServerImplemented = ServerImplemented;
export type IDictionary = IDictionary;
export type ServerParam = ServerParam;

export default Stalk;
