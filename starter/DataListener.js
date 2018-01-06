export class DataListener {
    constructor() {
        //#region IServerListener.
        this.onRoomAccessEventListeners = new Array();
        this.addOnRoomAccessListener = (listener) => {
            this.onRoomAccessEventListeners.push(listener);
        };
        this.removeOnRoomAccessListener = (listener) => {
            let id = this.onRoomAccessEventListeners.indexOf(listener);
            this.onRoomAccessEventListeners.splice(id, 1);
        };
        this.onAddRoomAccessEventListeners = new Array();
        this.addOnAddRoomAccessListener = (listener) => {
            this.onAddRoomAccessEventListeners.push(listener);
        };
        this.removeOnAddRoomAccessListener = (listener) => {
            let id = this.onAddRoomAccessEventListeners.indexOf(listener);
            this.onAddRoomAccessEventListeners.splice(id, 1);
        };
        this.onUpdateRoomAccessEventListeners = new Array();
        this.addOnUpdateRoomAccessListener = (listener) => {
            this.onUpdateRoomAccessEventListeners.push(listener);
        };
        this.removeOnUpdateRoomAccessListener = (listener) => {
            let id = this.onUpdateRoomAccessEventListeners.indexOf(listener);
            this.onUpdateRoomAccessEventListeners.splice(id, 1);
        };
        //#endregion
        // #region ChatListener...
        this.onChatEventListeners = new Array();
        this.onLeaveRoomListeners = new Array();
        // onGetMessagesReaders(dataEvent: DataEvent) {
        //     if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
        //         this.chatListenerImps.forEach(value => {
        //             value.onGetMessagesReaders(dataEvent);
        //         });
        //     }
        // };
        //#endregion
    }
    onUserLogin(dataEvent) {
        console.log("user loged In", JSON.stringify(dataEvent));
    }
    onUserLogout(dataEvent) {
        console.log("user loged Out", JSON.stringify(dataEvent));
    }
    onAccessRoom(dataEvent) {
        if (Array.isArray(dataEvent) && dataEvent.length > 0) {
            let data = dataEvent[0];
            // this.dataManager.setRoomAccessForUser(data);
            this.onRoomAccessEventListeners.map(listener => {
                listener(data);
            });
        }
    }
    onAddRoomAccess(dataEvent) {
        let datas = JSON.parse(JSON.stringify(dataEvent));
        if (!!datas[0].roomAccess && datas[0].roomAccess.length !== 0) {
            // this.dataManager.setRoomAccessForUser(dataEvent);
        }
        this.onAddRoomAccessEventListeners.map(value => value(dataEvent));
    }
    onUpdatedLastAccessTime(dataEvent) {
        // this.dataManager.updateRoomAccessForUser(dataEvent);
        this.onUpdateRoomAccessEventListeners.map(item => item(dataEvent));
    }
    addOnChatListener(listener) {
        this.onChatEventListeners.push(listener);
    }
    removeOnChatListener(listener) {
        let id = this.onChatEventListeners.indexOf(listener);
        this.onChatEventListeners.splice(id, 1);
    }
    onChat(data) {
        let chatMessageImp = data;
        this.onChatEventListeners.map((value, id, arr) => {
            value(chatMessageImp);
        });
    }
    ;
    addOnLeaveRoomListener(listener) {
        this.onLeaveRoomListeners.push(listener);
    }
    removeOnLeaveRoomListener(listener) {
        let id = this.onLeaveRoomListeners.indexOf(listener);
        this.onLeaveRoomListeners.splice(id, 1);
    }
    onLeaveRoom(data) {
        this.onLeaveRoomListeners.map(value => value(data));
    }
    ;
    onRoomJoin(data) {
    }
    ;
}
