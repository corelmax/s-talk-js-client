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
export var Utils;
(function (Utils) {
    Utils.statusCode = HttpStatusCode;
    Utils.tokenDecode = TokenDecode;
    Utils.serverParam = ServerParam;
    Utils.dataDict = DataDict;
})(Utils || (Utils = {}));
