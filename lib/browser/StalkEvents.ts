/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 * 
 * Ahoo Studio.co.th 
 */

export namespace StalkEvents {
    export const ON_PUSH = "ON_PUSH";
    export interface IPushServerListener {
        onPush(dataEvent);
    }

    export interface IChatServerEvents {
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
}