/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 * 
 * Ahoo Studio.co.th 
 */
export namespace ChatEvents {
    export const ON_ADD = "onAdd";
    export const ON_LEAVE: string = "onLeave";

    export const ON_CHAT: string = "ON_CHAT";
    export interface IChatServerEvents {
        onChat(data);
        onRoomJoin(data);
        onLeaveRoom(data);
    }
}
export namespace PushEvents {
    export const ON_PUSH = "ON_PUSH";
    export interface IPushServerListener {
        onPush(dataEvent);
    }
}
export namespace CallingEvents {
    export const ON_CALL = "ON_CALL";
    export interface ICallingListener {
        onCall(dataEvent);
    }

    export const VideoCall = "VideoCall";
    export const VoiceCall = "VoiceCall";
    export const HangupCall = "HangupCall";
    export const TheLineIsBusy = "TheLineIsBusy";
}
export namespace StalkEvents {
    export interface IServerListener {
        onAccessRoom(dataEvent);
        onUpdatedLastAccessTime(dataEvent);
        onAddRoomAccess(dataEvent);
    }

    export const ON_USER_LOGIN = "onUserLogin";
    export const ON_USER_LOGOUT = "onUserLogout";
    export interface BaseEvents {
        onUserLogin(dataEvent);
        onUserLogout(dataEvent);
    }
}