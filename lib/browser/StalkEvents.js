"use strict";
/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
var ChatEvents;
(function (ChatEvents) {
    ChatEvents.ON_ADD = "onAdd";
    ChatEvents.ON_LEAVE = "onLeave";
    ChatEvents.ON_CHAT = "onChat";
    ChatEvents.ON_MESSAGE_READ = "onMessageRead";
    ChatEvents.ON_GET_MESSAGES_READERS = "onGetMessagesReaders";
})(ChatEvents = exports.ChatEvents || (exports.ChatEvents = {}));
var StalkEvents;
(function (StalkEvents) {
    StalkEvents.ON_PUSH = "ON_PUSH";
})(StalkEvents = exports.StalkEvents || (exports.StalkEvents = {}));
var ConnectorEvents;
(function (ConnectorEvents) {
    ConnectorEvents.ON_USER_LOGIN = "onUserLogin";
    ConnectorEvents.ON_USER_LOGOUT = "onUserLogout";
})(ConnectorEvents = exports.ConnectorEvents || (exports.ConnectorEvents = {}));
