export declare module absSpartan {
    interface IChatServerListener {
        onChat(data: any): any;
        onLeaveRoom(data: any): any;
        onRoomJoin(data: any): any;
        onMessageRead(dataEvent: any): any;
        onGetMessagesReaders(dataEvent: any): any;
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
