import { absSpartan } from "../libs/stalk/spartanEvents";
import * as IRoomAccessEvents from "../libs/stalk/IRoomAccessEvents";
import { Message, RoomAccessData, Room, StalkAccount } from "./models/ChatDataModels";

import DataManager from "./dataManager";

type RoomAccessEvents = IRoomAccessEvents.absSpartan.IRoomAccessListenerImp;

export default class DataListener implements absSpartan.IServerListener, absSpartan.IChatServerListener {
    private dataManager: DataManager;

    private notifyNewMessageEvents = new Array<(message: Message) => void>();
    public addNoticeNewMessageEvent(listener: (message: Message) => void) {
        if (this.notifyNewMessageEvents.length === 0) {
            this.notifyNewMessageEvents.push(listener);
        }
    }
    public removeNoticeNewMessageEvent(listener: (message: Message) => void) {
        let id = this.notifyNewMessageEvents.indexOf(listener);
        this.notifyNewMessageEvents.splice(id, 1);
    }

    private chatListenerImps = new Array<absSpartan.IChatServerListener>();
    public addChatListenerImp(listener: absSpartan.IChatServerListener) {
        this.chatListenerImps.push(listener);
    }
    public removeChatListenerImp(listener: absSpartan.IChatServerListener) {
        let id = this.chatListenerImps.indexOf(listener);
        this.chatListenerImps.splice(id, 1);

        console.log("chatListenerImps", this.chatListenerImps.length);
    }

    private roomAccessListenerImps = new Array<RoomAccessEvents>();
    public addRoomAccessListenerImp(listener: RoomAccessEvents) {
        this.roomAccessListenerImps.push(listener);
    }
    public removeRoomAccessListener(listener: RoomAccessEvents) {
        var id = this.roomAccessListenerImps.indexOf(listener);
        this.roomAccessListenerImps.splice(id, 1);
    }

    constructor(dataManager: DataManager) {
        this.dataManager = dataManager;
    }

    onAccessRoom(dataEvent) {
        let data = dataEvent[0];
        console.info('onAccessRoom: ', data);

        this.dataManager.setRoomAccessForUser(data);

        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(value => {
                value.onAccessRoom(data);
            });
        }
    }

    onUpdatedLastAccessTime(dataEvent) {
        this.dataManager.updateRoomAccessForUser(dataEvent);

        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(value => {
                value.onUpdatedLastAccessTime(dataEvent);
            });
        }
    }

    onAddRoomAccess(dataEvent) {
        let datas: Array<StalkAccount> = JSON.parse(JSON.stringify(dataEvent));
        if (!!datas[0].roomAccess && datas[0].roomAccess.length !== 0) {
            this.dataManager.setRoomAccessForUser(dataEvent);
        }

        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(value => {
                value.onAddRoomAccess(dataEvent);
            });
        }
    }

    onCreateGroupSuccess(dataEvent) {
        let group: Room = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.addGroup(group);
    }

    onEditedGroupMember(dataEvent) {
        let jsonObj: Room = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.updateGroupMembers(jsonObj);

        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(value => {
                value.onEditedGroupMember(dataEvent);
            });
        }
    }

    onEditedGroupName(dataEvent) {
        let jsonObj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.updateGroupName(jsonObj);
    }

    onEditedGroupImage(dataEvent) {
        let obj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.updateGroupImage(obj);
    }

    onNewGroupCreated(dataEvent) {
        let jsonObj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.addGroup(jsonObj);
    }

    onUpdateMemberInfoInProjectBase(dataEvent) {
        let jsonObj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.updateGroupMemberDetail(jsonObj);
        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(value => {
                value.onUpdateMemberInfoInProjectBase(dataEvent);
            });
        }
    }


    //#region User.

    onUserLogin(dataEvent) {
        this.dataManager.onUserLogin(dataEvent);
    }

    onUserUpdateImageProfile(dataEvent) {
        var jsonObj = JSON.parse(JSON.stringify(dataEvent));
        var _id = jsonObj._id;
        var path = jsonObj.path;

        this.dataManager.updateContactImage(_id, path);
    }

    onUserUpdateProfile(dataEvent) {
        var jsonobj = JSON.parse(JSON.stringify(dataEvent));
        var params = jsonobj.params;
        var _id = jsonobj._id;

        this.dataManager.updateContactProfile(_id, params);
    }

    //#endregion

    /*******************************************************************************/
    //<!-- chat room data listener.
    onChat(data) {
        let chatMessageImp: Message = JSON.parse(JSON.stringify(data));

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
    };

    onLeaveRoom(data) {
        if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
            this.chatListenerImps.forEach(value => {
                value.onLeaveRoom(data);
            });
        }
    };

    onRoomJoin(data) {

    };

    onMessageRead(dataEvent) {
        if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
            this.chatListenerImps.forEach(value => {
                value.onMessageRead(dataEvent);
            });
        }
    };

    onGetMessagesReaders(dataEvent) {
        if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
            this.chatListenerImps.forEach(value => {
                value.onGetMessagesReaders(dataEvent);
            });
        }
    };
}