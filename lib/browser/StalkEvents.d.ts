/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
export declare type DataEvent = (data: any) => void;
export declare type BaseDataEvent = (eventName: string, data: any) => void;
export declare namespace StalkEvents {
    interface IServerListener {
        onAccessRoom: DataEvent;
        onUpdatedLastAccessTime: DataEvent;
        onAddRoomAccess: DataEvent;
        onActiveUser: BaseDataEvent;
        /** @deprecated */
        onUserLogin: DataEvent;
        /** @deprecated */
        onUserLogout: DataEvent;
    }
    const ON_USER_LOGIN = "onUserLogin";
    const ON_USER_LOGOUT = "onUserLogout";
}
