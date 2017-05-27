import { ServerImplemented, IDictionary, ServerParam } from "./lib/browser/serverImplemented";
import { ChatRoomApiProvider } from "./lib/browser/chatRoomApiProvider";
import { ServerEventListener } from "./lib/browser/serverEventListener";

import { HttpStatusCode } from "./lib/utils/httpStatusCode";
import { TokenDecode } from "./lib/utils/tokenDecode";

// let Stalk = Object.create(null);
export const Stalk = ServerImplemented; // require("./lib/browser/serverImplemented");
export const ChatRoom = ChatRoomApiProvider; // require("./lib/browser/chatRoomApiProvider");
export const Events = ServerEventListener;

export let Utils = Object.create(null);
Utils.token = TokenDecode;
Utils.statusCode = HttpStatusCode;

export type ServerImplemented = ServerImplemented;
export type IDictionary = IDictionary;
export type ServerParam = ServerParam;

// export default Stalk;
