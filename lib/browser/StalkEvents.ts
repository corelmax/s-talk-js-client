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
        onChat: (data: any) => void;
        onRoomJoin: (data: any) => void;
        onLeaveRoom: (data: any) => void;
    }
}
export namespace PushEvents {
    export const ON_PUSH = "ON_PUSH";
    export interface IPushServerListener {
        onPush: (data: any) => void;
    }
}
export namespace CallingEvents {
    export const ON_CALL = "ON_CALL";
    export interface ICallingListener {
        onCall: (data: any) => void;
    }

    export const VideoCall = "VideoCall";
    export const VoiceCall = "VoiceCall";
    export const HangupCall = "HangupCall";
    export const TheLineIsBusy = "TheLineIsBusy";
}
export namespace StalkEvents {
    export interface IServerListener {
        onAccessRoom: (data: any) => void;
        onUpdatedLastAccessTime: (data: any) => void;
        onAddRoomAccess: (data: any) => void;
    }

    export const ON_USER_LOGIN = "onUserLogin";
    export const ON_USER_LOGOUT = "onUserLogout";
    export interface BaseEvents {
        onUserLogin: (data: any) => void;
        onUserLogout: (data: any) => void;
    }
}