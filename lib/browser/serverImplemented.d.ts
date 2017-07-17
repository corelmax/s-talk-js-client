/// <reference types="node" />
/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
import * as EventEmitter from "events";
import { API } from './API';
export interface IPomelo extends EventEmitter {
    init: any;
    notify: any;
    request: any;
    disconnect: any;
    setReconnect: any;
    setInitCallback: (error: string) => void;
}
export interface IServer {
    host: string;
    port: number;
}
export interface IDictionary {
    [k: string]: string | any;
}
export declare namespace Stalk {
    class ServerImplemented {
        private static Instance;
        static getInstance(): ServerImplemented;
        static createInstance(host: string, port: number): ServerImplemented;
        private socket;
        getSocket(): IPomelo;
        private lobby;
        getLobby(): API.LobbyAPI;
        private chatroomAPI;
        getChatRoomAPI(): API.ChatRoomAPI;
        private callingAPI;
        getCallingAPI(): API.CallingAPI;
        host: string;
        port: number | string;
        authenData: Stalk.IAuthenData;
        _isConnected: boolean;
        _isLogedin: boolean;
        connect: (params: ServerParam, callback: (err: any) => void) => void;
        onSocketOpen: (data) => void;
        onSocketClose: (data) => void;
        onSocketReconnect: (data) => void;
        onDisconnected: (data) => void;
        constructor(host: string, port: number);
        dispose(): void;
        disConnect(callBack?: Function): void;
        init(callback: (err, res: IPomelo) => void): void;
        private connectServer(params, callback);
        listenSocketEvents(): void;
        logIn(_username: string, _hash: string, deviceToken: string, callback: (err, res) => void): void;
        private authenForFrontendServer(_username, _hash, deviceToken, callback);
        gateEnter(msg: IDictionary): Promise<IServer>;
        TokenAuthen(tokenBearer: string, checkTokenCallback: (err, res) => void): void;
        private OnTokenAuthenticate(tokenRes, onSuccessCheckToken);
        kickMeAllSession(uid: string): void;
        UpdateUserProfile(myId: string, profileFields: {
            [k: string]: string;
        }, callback: (err, res) => void): void;
        ProfileImageChanged(userId: string, path: string, callback: (err, res) => void): void;
        getMe(msg: IDictionary, callback: (err, res) => void): void;
        updateFavoriteMember(editType: string, member: string, callback: (err, ress) => void): void;
        updateFavoriteGroups(editType: string, group: string, callback: (err, res) => void): void;
        updateClosedNoticeMemberList(editType: string, member: string, callback: (err, res) => void): void;
        updateClosedNoticeGroupsList(editType: string, group: string, callback: (err, res) => void): void;
        getMemberProfile(userId: string, callback: (err, res) => void): void;
        getCompanyInfo(callBack: (err, res) => void): void;
        getCompanyMembers(callBack: (err, res) => void): void;
        getOrganizationGroups(callBack: (err, res) => void): void;
        getProjectBaseGroups(callback: (err, res) => void): void;
        requestCreateProjectBaseGroup(groupName: string, members: any[], callback: (err, res) => void): void;
        editMemberInfoInProjectBase(roomId: string, roomType: any, member: any, callback: (err, res) => void): void;
        getPrivateGroups(callback: (err, res) => void): void;
        UserRequestCreateGroupChat(groupName: string, memberIds: string[], callback: (err, res) => void): void;
        UpdatedGroupImage(groupId: string, path: string, callback: (err, res) => void): void;
        editGroupMembers(editType: string, roomId: string, roomType: any, members: string[], callback: (err, res) => void): void;
        editGroupName(roomId: string, roomType: any, newGroupName: string, callback: (err, res) => void): void;
        getPrivateChatRoomId(token: string, myId: string, myRoommateId: string, callback: (err, res) => void): void;
    }
    interface IAuthenData {
        userId: string;
        token: string;
    }
    class ServerParam implements IServer {
        host: string;
        port: number;
        reconnect: boolean;
    }
}
