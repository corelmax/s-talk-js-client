/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
export var StalkEvents;
(function (StalkEvents) {
    StalkEvents.ON_USER_LOGIN = "onUserLogin";
    StalkEvents.ON_USER_LOGOUT = "onUserLogout";
    let CallingEvents;
    (function (CallingEvents) {
        CallingEvents.ON_CALL = "ON_CALL";
        CallingEvents.VideoCall = "VideoCall";
        CallingEvents.VoiceCall = "VoiceCall";
        CallingEvents.HangupCall = "HangupCall";
        CallingEvents.TheLineIsBusy = "TheLineIsBusy";
    })(CallingEvents = StalkEvents.CallingEvents || (StalkEvents.CallingEvents = {}));
    let ChatEvents;
    (function (ChatEvents) {
        ChatEvents.ON_ADD = "onAdd";
        ChatEvents.ON_LEAVE = "onLeave";
        ChatEvents.ON_CHAT = "ON_CHAT";
    })(ChatEvents = StalkEvents.ChatEvents || (StalkEvents.ChatEvents = {}));
    let PushEvents;
    (function (PushEvents) {
        PushEvents.ON_PUSH = "ON_PUSH";
    })(PushEvents = StalkEvents.PushEvents || (StalkEvents.PushEvents = {}));
})(StalkEvents || (StalkEvents = {}));
