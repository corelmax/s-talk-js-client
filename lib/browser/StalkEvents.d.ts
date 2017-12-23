/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
export declare namespace StalkEvents {
    interface IServerListener {
        onAccessRoom: (data: any) => void;
        onUpdatedLastAccessTime: (data: any) => void;
        onAddRoomAccess: (data: any) => void;
    }
    const ON_USER_LOGIN = "onUserLogin";
    const ON_USER_LOGOUT = "onUserLogout";
    interface BaseEvents {
        onUserLogin: (data: any) => void;
        onUserLogout: (data: any) => void;
    }
    module CallingEvents {
        const ON_CALL = "ON_CALL";
        interface ICallingListener {
            onCall: (data: any) => void;
        }
        const VideoCall = "VideoCall";
        const VoiceCall = "VoiceCall";
        const HangupCall = "HangupCall";
        const TheLineIsBusy = "TheLineIsBusy";
    }
    module ChatEvents {
        const ON_ADD = "onAdd";
        const ON_LEAVE: string;
        const ON_CHAT: string;
        interface IChatServerEvents {
            onChat: (data: any) => void;
            onRoomJoin: (data: any) => void;
            onLeaveRoom: (data: any) => void;
        }
    }
    module PushEvents {
        const ON_PUSH = "ON_PUSH";
        interface IPushServerListener {
            onPush: (data: any) => void;
        }
    }
}
