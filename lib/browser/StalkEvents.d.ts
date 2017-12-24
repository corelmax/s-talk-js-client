/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
export declare type DataEvent = (data: any) => void;
export declare namespace ChatEvents {
    const ON_ADD = "onAdd";
    const ON_LEAVE: string;
    const ON_CHAT: string;
    interface IChatServerEvents {
        onChat: DataEvent;
        onRoomJoin: DataEvent;
        onLeaveRoom: DataEvent;
    }
}
export declare namespace PushEvents {
    const ON_PUSH = "ON_PUSH";
    interface IPushServerListener {
        onPush: DataEvent;
    }
}
export declare namespace CallingEvents {
    const ON_CALL = "ON_CALL";
    interface ICallingListener {
        onCall: DataEvent;
    }
    const VideoCall = "VideoCall";
    const VoiceCall = "VoiceCall";
    const HangupCall = "HangupCall";
    const TheLineIsBusy = "TheLineIsBusy";
}
export declare namespace StalkEvents {
    interface IServerListener {
        onAccessRoom: DataEvent;
        onUpdatedLastAccessTime: DataEvent;
        onAddRoomAccess: DataEvent;
        onUserLogin: DataEvent;
        onUserLogout: DataEvent;
    }
    const ON_USER_LOGIN = "onUserLogin";
    const ON_USER_LOGOUT = "onUserLogout";
}
