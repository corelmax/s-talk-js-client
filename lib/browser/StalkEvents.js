/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
export var ChatEvents;
(function (ChatEvents) {
    ChatEvents.ON_ADD = "onAdd";
    ChatEvents.ON_LEAVE = "onLeave";
    ChatEvents.ON_CHAT = "ON_CHAT";
})(ChatEvents || (ChatEvents = {}));
export var PushEvents;
(function (PushEvents) {
    PushEvents.ON_PUSH = "ON_PUSH";
})(PushEvents || (PushEvents = {}));
export var CallingEvents;
(function (CallingEvents) {
    CallingEvents.ON_CALL = "ON_CALL";
    CallingEvents.VideoCall = "VideoCall";
    CallingEvents.VoiceCall = "VoiceCall";
    CallingEvents.HangupCall = "HangupCall";
    CallingEvents.TheLineIsBusy = "TheLineIsBusy";
})(CallingEvents || (CallingEvents = {}));
export var StalkEvents;
(function (StalkEvents) {
    StalkEvents.ON_USER_LOGIN = "onUserLogin";
    StalkEvents.ON_USER_LOGOUT = "onUserLogout";
})(StalkEvents || (StalkEvents = {}));
