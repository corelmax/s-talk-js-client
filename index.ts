/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 * 
 * Ahoo Studio.co.th 
 */

export { Stalk } from "./lib/browser/serverImplemented";
export { ChatRoomApi } from "./lib/browser/chatRoomApiProvider";
export { StalkEvents } from "./lib/browser/StalkEvents";

import { HttpStatusCode } from "./lib/utils/httpStatusCode";
import { TokenDecode } from "./lib/utils/tokenDecode";
import { ServerParam, DataDict } from "./lib/browser/serverImplemented";

export namespace Utils {
    export var statusCode = HttpStatusCode;
    export var tokenDecode = TokenDecode;
    export var serverParam = ServerParam;
    export var dataDict = DataDict;
}