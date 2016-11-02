import DataManager from "./dataManager";
const dataManager = DataManager.getInstance();
export default class DataListener {
    constructor() {
        this.notifyNewMessageEvents = new Array();
        this.chatListenerImps = new Array();
        this.roomAccessListenerImps = new Array();
    }
    static getInstance() {
        if (!DataListener.instance) {
            DataListener.instance = new DataListener();
        }
        return DataListener.instance;
    }
    addNoticeNewMessageEvent(listener) {
        if (this.notifyNewMessageEvents.length === 0) {
            this.notifyNewMessageEvents.push(listener);
        }
    }
    removeNoticeNewMessageEvent(listener) {
        let id = this.notifyNewMessageEvents.indexOf(listener);
        this.notifyNewMessageEvents.splice(id, 1);
    }
    addChatListenerImp(listener) {
        this.chatListenerImps.push(listener);
    }
    removeChatListenerImp(listener) {
        let id = this.chatListenerImps.indexOf(listener);
        this.chatListenerImps.splice(id, 1);
        console.log("chatListenerImps", this.chatListenerImps.length);
    }
    addRoomAccessListenerImp(listener) {
        this.roomAccessListenerImps.push(listener);
    }
    removeRoomAccessListener(listener) {
        var id = this.roomAccessListenerImps.indexOf(listener);
        this.roomAccessListenerImps.splice(id, 1);
    }
    onAccessRoom(dataEvent) {
        let data = dataEvent[0];
        console.info('onAccessRoom: ', data);
        dataManager.setRoomAccessForUser(data);
        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(value => {
                value.onAccessRoom(data);
            });
        }
    }
    onUpdatedLastAccessTime(dataEvent) {
        dataManager.updateRoomAccessForUser(dataEvent);
        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(value => {
                value.onUpdatedLastAccessTime(dataEvent);
            });
        }
    }
    onAddRoomAccess(dataEvent) {
        let datas = JSON.parse(JSON.stringify(dataEvent));
        if (!!datas[0].roomAccess && datas[0].roomAccess.length !== 0) {
            dataManager.setRoomAccessForUser(dataEvent);
        }
        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(value => {
                value.onAddRoomAccess(dataEvent);
            });
        }
    }
    onCreateGroupSuccess(dataEvent) {
        var group = JSON.parse(JSON.stringify(dataEvent));
        dataManager.addGroup(group);
    }
    onEditedGroupMember(dataEvent) {
        var jsonObj = JSON.parse(JSON.stringify(dataEvent));
        dataManager.updateGroupMembers(jsonObj);
        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(value => {
                value.onEditedGroupMember(dataEvent);
            });
        }
    }
    onEditedGroupName(dataEvent) {
        var jsonObj = JSON.parse(JSON.stringify(dataEvent));
        dataManager.updateGroupName(jsonObj);
    }
    onEditedGroupImage(dataEvent) {
        var obj = JSON.parse(JSON.stringify(dataEvent));
        dataManager.updateGroupImage(obj);
    }
    onNewGroupCreated(dataEvent) {
        var jsonObj = JSON.parse(JSON.stringify(dataEvent));
        dataManager.addGroup(jsonObj);
    }
    onUpdateMemberInfoInProjectBase(dataEvent) {
        var jsonObj = JSON.parse(JSON.stringify(dataEvent));
        dataManager.updateGroupMemberDetail(jsonObj);
        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(value => {
                value.onUpdateMemberInfoInProjectBase(dataEvent);
            });
        }
    }
    //#region User.
    onUserLogin(dataEvent) {
        dataManager.onUserLogin(dataEvent);
    }
    onUserUpdateImageProfile(dataEvent) {
        var jsonObj = JSON.parse(JSON.stringify(dataEvent));
        var _id = jsonObj._id;
        var path = jsonObj.path;
        dataManager.updateContactImage(_id, path);
    }
    onUserUpdateProfile(dataEvent) {
        var jsonobj = JSON.parse(JSON.stringify(dataEvent));
        var params = jsonobj.params;
        var _id = jsonobj._id;
        dataManager.updateContactProfile(_id, params);
    }
    //#endregion
    /*******************************************************************************/
    //<!-- chat room data listener.
    onChat(data) {
        let chatMessageImp = JSON.parse(JSON.stringify(data));
        if (!!this.notifyNewMessageEvents && this.notifyNewMessageEvents.length !== 0) {
            this.notifyNewMessageEvents.map((v, id, arr) => {
                v(chatMessageImp);
            });
        }
        if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
            this.chatListenerImps.forEach((value, id, arr) => {
                value.onChat(chatMessageImp);
            });
        }
        if (!!this.roomAccessListenerImps && this.roomAccessListenerImps.length !== 0) {
            this.roomAccessListenerImps.map(v => {
                v.onChat(chatMessageImp);
            });
        }
    }
    ;
    onLeaveRoom(data) {
        if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
            this.chatListenerImps.forEach(value => {
                value.onLeaveRoom(data);
            });
        }
    }
    ;
    onRoomJoin(data) {
    }
    ;
    onMessageRead(dataEvent) {
        if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
            this.chatListenerImps.forEach(value => {
                value.onMessageRead(dataEvent);
            });
        }
    }
    ;
    onGetMessagesReaders(dataEvent) {
        if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
            this.chatListenerImps.forEach(value => {
                value.onGetMessagesReaders(dataEvent);
            });
        }
    }
    ;
}
