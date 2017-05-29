/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
export declare namespace StalkEvents {
    const ON_PUSH = "ON_PUSH";
    interface IPushServerListener {
        onPush(dataEvent: any): any;
    }
    interface IChatServerEvents {
        onChat(data: any): any;
        onMessageRead(dataEvent: any): any;
        onGetMessagesReaders(dataEvent: any): any;
        onRoomJoin(data: any): any;
        onLeaveRoom(data: any): any;
    }
    interface IFrontendServerListener {
        onGetMe(dataEvent: any): any;
        onGetCompanyInfo(dataEvent: any): any;
        onGetCompanyMemberComplete(dataEvent: any): any;
        onGetPrivateGroupsComplete(dataEvent: any): any;
        onGetOrganizeGroupsComplete(dataEvent: any): any;
        onGetProjectBaseGroupsComplete(dataEvent: any): any;
    }
    interface IRTCListener {
        onVideoCall(dataEvent: any): any;
        onVoiceCall(dataEvent: any): any;
        onHangupCall(dataEvent: any): any;
        onTheLineIsBusy(dataEvent: any): any;
    }
    interface IServerListener {
        onAccessRoom(dataEvent: any): any;
        onUpdatedLastAccessTime(dataEvent: any): any;
        onAddRoomAccess(dataEvent: any): any;
        onCreateGroupSuccess(dataEvent: any): any;
        onEditedGroupMember(dataEvent: any): any;
        onEditedGroupName(dataEvent: any): any;
        onEditedGroupImage(dataEvent: any): any;
        onNewGroupCreated(dataEvent: any): any;
        onUpdateMemberInfoInProjectBase(dataEvent: any): any;
        onUserLogin(dataEvent: any): any;
        onUserUpdateImageProfile(dataEvent: any): any;
        onUserUpdateProfile(dataEvent: any): any;
    }
}
