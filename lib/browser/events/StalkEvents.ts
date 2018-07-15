/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 * 
 * Ahoo Studio.co.th 
 */

export type DataEvent = (data: any) => void;
export type BaseDataEvent = (eventName: string, data: any) => void;

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