/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 * 
 * Ahoo Studio.co.th 
 */

export type DataEvent = (data: any) => void;
export type BaseDataEvent = (eventName: string, data: any) => void;

export namespace ChatEvents {
    export const ON_ADD = "onAdd";
    export const ON_LEAVE: string = "onLeave";

    export const ON_CHAT: string = "ON_CHAT";
    export interface IChatServerEvents {
        onChat: DataEvent;
        onRoomJoin: DataEvent;
        onLeaveRoom: DataEvent;
    }
}
export namespace PushEvents {
    export const ON_PUSH = "ON_PUSH";
    export interface IPushServerListener {
        onPush: DataEvent;
    }
}
export namespace CallingEvents {
    export const ON_CALL = "ON_CALL";
    export interface ICallingListener {
        onCall: DataEvent;
    }

    export const VideoCall = "VideoCall";
    export const VoiceCall = "VoiceCall";
    export const HangupCall = "HangupCall";
    export const TheLineIsBusy = "TheLineIsBusy";
}
export namespace StalkEvents {
    export interface IServerListener {
        onAccessRoom: DataEvent;
        onUpdatedLastAccessTime: DataEvent;
        onAddRoomAccess: DataEvent;
        onActiveUser: BaseDataEvent;
        /** @deprecated */
        onUserLogin: DataEvent;
        /** @deprecated */
        onUserLogout: DataEvent;
    }

    export const ON_USER_LOGIN = "onUserLogin";
    export const ON_USER_LOGOUT = "onUserLogout";
}