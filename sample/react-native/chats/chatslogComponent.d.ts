import { IRoomAccessListenerImp } from "./abstracts/IRoomAccessListenerImp";
import * as DataModels from "./models/ChatDataModels";
import ChatLog from "./models/chatLog";
import DataManager from "./dataManager";
import DataListener from "./dataListener";
import ServerImplement from "../libs/stalk/serverImplemented";
export interface ChatLogMap {
    [key: string]: ChatLog;
}
export interface IUnread {
    message: DataModels.Message;
    rid: string;
    count: number;
}
export declare class Unread {
    message: DataModels.Message;
    rid: string;
    count: number;
}
export default class ChatsLogComponent implements IRoomAccessListenerImp {
    serverImp: ServerImplement;
    dataManager: DataManager;
    dataListener: DataListener;
    private convertDateService;
    private chatslog;
    getChatsLog(): ChatLogMap;
    private unreadMessageMap;
    getUnreadMessageMap(): Map<string, IUnread>;
    addUnreadMessage(unread: IUnread): void;
    getUnreadItem(room_id: string): IUnread;
    private chatlog_count;
    _isReady: boolean;
    onReady: () => void;
    getRoomsInfoCompleteEvent: () => void;
    constructor(_convertDateService?: any);
    private chatListeners;
    addOnChatListener(listener: any): void;
    onChat(dataEvent: any): void;
    onAccessRoom(dataEvent: any): void;
    updatedLastAccessTimeEvent: (data) => void;
    onUpdatedLastAccessTime(dataEvent: any): void;
    addNewRoomAccessEvent: (data) => void;
    onAddRoomAccess(dataEvent: any): void;
    onUpdateMemberInfoInProjectBase(dataEvent: any): void;
    onEditedGroupMember(dataEvent: any): void;
    getUnreadMessages(token: string, roomAccess: DataModels.RoomAccessData[], callback: (err, logsData: Array<IUnread>) => void): void;
    getUnreadMessage(token: string, roomAccess: DataModels.RoomAccessData, callback: (err, res: IUnread) => void): void;
    private updatePersistRoomInfo(roomInfo);
    private decorateRoomInfoData(roomInfo);
    private getRoomInfo(room_id, callback);
    getRoomsInfo(): void;
    private organizeChatLogMap(unread, roomInfo, done);
    private setLogProp(log, displayMessage, callback);
    private addChatLog(chatLog, done);
    checkRoomInfo(unread: IUnread): Promise<any>;
    getChatsLogCount(): number;
    increaseChatsLogCount(num: number): void;
    decreaseChatsLogCount(num: number): void;
    calculateChatsLogCount(): void;
}
