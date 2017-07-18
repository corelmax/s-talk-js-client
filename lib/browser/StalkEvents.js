"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    ChatEvents.ON_MESSAGE_READ = "onMessageRead";
    ChatEvents.ON_GET_MESSAGES_READERS = "onGetMessagesReaders";
    ChatEvents.ON_CHAT = "ON_CHAT";
})(ChatEvents = exports.ChatEvents || (exports.ChatEvents = {}));
var PushEvents;
(function (PushEvents) {
    PushEvents.ON_PUSH = "ON_PUSH";
})(PushEvents = exports.PushEvents || (exports.PushEvents = {}));
var CallingEvents;
(function (CallingEvents) {
    CallingEvents.ON_CALL = "ON_CALL";
    CallingEvents.VideoCall = "VideoCall";
    CallingEvents.VoiceCall = "VoiceCall";
    CallingEvents.HangupCall = "HangupCall";
    CallingEvents.TheLineIsBusy = "TheLineIsBusy";
})(CallingEvents = exports.CallingEvents || (exports.CallingEvents = {}));
var StalkEvents;
(function (StalkEvents) {
    StalkEvents.ON_USER_LOGIN = "onUserLogin";
    StalkEvents.ON_USER_LOGOUT = "onUserLogout";
})(StalkEvents = exports.StalkEvents || (exports.StalkEvents = {}));
