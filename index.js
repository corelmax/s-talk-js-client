/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
"use strict";
var serverImplemented_1 = require("./lib/browser/serverImplemented");
exports.Stalk = serverImplemented_1.Stalk;
var chatRoomApiProvider_1 = require("./lib/browser/chatRoomApiProvider");
exports.ChatRoomApi = chatRoomApiProvider_1.ChatRoomApi;
var StalkEvents_1 = require("./lib/browser/StalkEvents");
exports.StalkEvents = StalkEvents_1.StalkEvents;
var httpStatusCode_1 = require("./lib/utils/httpStatusCode");
var tokenDecode_1 = require("./lib/utils/tokenDecode");
var Utils;
(function (Utils) {
    Utils.statusCode = httpStatusCode_1.HttpStatusCode;
    Utils.tokenDecode = tokenDecode_1.Authen.TokenDecoded;
})(Utils = exports.Utils || (exports.Utils = {}));
