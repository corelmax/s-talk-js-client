export namespace absSpartan {
    export interface IChatServerListener {
        onChat(data);
        onMessageRead(dataEvent);
        onGetMessagesReaders(dataEvent);
        onRoomJoin(data);
        onLeaveRoom(data);
    }
    export interface IFrontendServerListener {
        onGetMe(dataEvent);
        onGetCompanyInfo(dataEvent);
        onGetCompanyMemberComplete(dataEvent);
        onGetPrivateGroupsComplete(dataEvent);
        onGetOrganizeGroupsComplete(dataEvent);
        onGetProjectBaseGroupsComplete(dataEvent);
    }
    export interface IRTCListener {
        onVideoCall(dataEvent);
        onVoiceCall(dataEvent);
        onHangupCall(dataEvent);
        onTheLineIsBusy(dataEvent);
    }
    export interface IServerListener {
        onAccessRoom(dataEvent);
        onUpdatedLastAccessTime(dataEvent);
        onAddRoomAccess(dataEvent);

        onCreateGroupSuccess(dataEvent);
        onEditedGroupMember(dataEvent);
        onEditedGroupName(dataEvent);
        onEditedGroupImage(dataEvent);
        onNewGroupCreated(dataEvent);

        onUpdateMemberInfoInProjectBase(dataEvent);

        onUserLogin(dataEvent);
        onUserUpdateImageProfile(dataEvent);
        onUserUpdateProfile(dataEvent);
    }
    export interface IPushServerListener {
        onPush(dataEvent);
    }
}

export namespace StalkEvents {
    export const ON_PUSH = "ON_PUSH";
}