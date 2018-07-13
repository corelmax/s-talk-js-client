import { ChatEvents, StalkEvents } from "../index";
import { IMessage, RoomAccessData, StalkAccount } from "./models/index";

export class DataListener implements
    StalkEvents.IServerListener,
    ChatEvents.IChatServerEvents {

    constructor() {
        this.activeUserEvents = new Array();
    }

    //#region IServerListener.

    private activeUserEvents: Array<(key: string, data: any) => void>;
    public addActiveUserEventListener(listener: (key: string, data: any) => void) {
        if (this.activeUserEvents && this.activeUserEvents.indexOf(listener) < 0) {
            this.activeUserEvents.push(listener);
        }
    }
    public removeActiveUserEventListener(listener: (key: string, data: any) => void) {
        const index = this.activeUserEvents.indexOf(listener);
        this.activeUserEvents.splice(index, 1);
    }
    public onActiveUser(eventName: string, data: any) {
        console.log(eventName, JSON.stringify(data));
        if (this.activeUserEvents && this.activeUserEvents.length > 0) {
            this.activeUserEvents.map((listener) => {
                listener(eventName, data);
            });
        }
    }
    public onUserLogin(dataEvent: any) {
        /*
        console.log("user loged In", JSON.stringify(dataEvent));
        if (this.activeUserEvents && this.activeUserEvents.length) {
            this.activeUserEvents.map(listener => {
                listener(dataEvent);
            });
        }
        */
    }

    public onUserLogout(dataEvent: any) {
        /*
        console.log("user loged Out", JSON.stringify(dataEvent));
        if (this.activeUserEvents && this.activeUserEvents.length) {
            this.activeUserEvents.map(listener => {
                listener(dataEvent);
            });
        }
        */
    }

    private onRoomAccessEventListeners = new Array<(data: StalkAccount) => void>();
    public addOnRoomAccessListener = (listener: (data: StalkAccount) => void) => {
        this.onRoomAccessEventListeners.push(listener);
    }
    public removeOnRoomAccessListener = (listener: (data: any) => void) => {
        const id = this.onRoomAccessEventListeners.indexOf(listener);
        this.onRoomAccessEventListeners.splice(id, 1);
    }
    public onAccessRoom(dataEvent: any[]) {
        if (Array.isArray(dataEvent) && dataEvent.length > 0) {
            const data = dataEvent[0] as StalkAccount;

            // this.dataManager.setRoomAccessForUser(data);

            this.onRoomAccessEventListeners.map((listener) => {
                listener(data);
            });
        }
    }

    private onAddRoomAccessEventListeners = new Array();
    public addOnAddRoomAccessListener = (listener: (data: any) => void) => {
        this.onAddRoomAccessEventListeners.push(listener);
    }
    public removeOnAddRoomAccessListener = (listener: (data: any) => void) => {
        const id = this.onAddRoomAccessEventListeners.indexOf(listener);
        this.onAddRoomAccessEventListeners.splice(id, 1);
    }
    public onAddRoomAccess(dataEvent: any) {
        const datas: StalkAccount[] = JSON.parse(JSON.stringify(dataEvent));
        if (!!datas[0].roomAccess && datas[0].roomAccess.length !== 0) {
            // this.dataManager.setRoomAccessForUser(dataEvent);
        }

        this.onAddRoomAccessEventListeners.map((value) => value(dataEvent));
    }

    private onUpdateRoomAccessEventListeners = new Array<(data: RoomAccessData) => void>();
    public addOnUpdateRoomAccessListener = (listener: (data: RoomAccessData) => void) => {
        this.onUpdateRoomAccessEventListeners.push(listener);
    }
    public removeOnUpdateRoomAccessListener = (listener: (data: RoomAccessData) => void) => {
        const id = this.onUpdateRoomAccessEventListeners.indexOf(listener);
        this.onUpdateRoomAccessEventListeners.splice(id, 1);
    }
    public onUpdatedLastAccessTime(dataEvent: RoomAccessData) {
        // this.dataManager.updateRoomAccessForUser(dataEvent);

        this.onUpdateRoomAccessEventListeners.map((item) => item(dataEvent));
    }

    //#endregion

    // #region ChatListener...

    private onChatEventListeners = new Array<(message: IMessage) => void>();
    public addOnChatListener(listener: (message: IMessage) => void) {
        this.onChatEventListeners.push(listener);
    }
    public removeOnChatListener(listener: (message: IMessage) => void) {
        const id = this.onChatEventListeners.indexOf(listener);
        this.onChatEventListeners.splice(id, 1);
    }

    public onChat(data: any) {
        const chatMessageImp = data as IMessage;
        this.onChatEventListeners.map((value, id, arr) => {
            value(chatMessageImp);
        });
    }

    private onLeaveRoomListeners = new Array();
    public addOnLeaveRoomListener(listener: (message: IMessage) => void) {
        this.onLeaveRoomListeners.push(listener);
    }
    public removeOnLeaveRoomListener(listener: (message: IMessage) => void) {
        const id = this.onLeaveRoomListeners.indexOf(listener);
        this.onLeaveRoomListeners.splice(id, 1);
    }
    public onLeaveRoom(data: any) {
        this.onLeaveRoomListeners.map((value) => value(data));
    }

    public onRoomJoin(data: any) {

    }

    // onGetMessagesReaders(dataEvent: DataEvent) {
    //     if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
    //         this.chatListenerImps.forEach(value => {
    //             value.onGetMessagesReaders(dataEvent);
    //         });
    //     }
    // };

    //#endregion
}
