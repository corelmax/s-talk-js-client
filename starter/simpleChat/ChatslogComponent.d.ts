import { DataListener } from "../DataListener";
import ChatLog from "./models/ChatLog";
import { IMessage, RoomAccessData, StalkAccount } from "../models/index";
import { Room, MessageImp } from "./models/index";
export declare type ChatLogMap = Map<string, ChatLog>;
export declare type UnreadMap = Map<string, IUnread>;
export interface IUnread {
    message: IMessage;
    rid: string;
    count: number;
}
export declare class Unread {
    message: IMessage;
    rid: string;
    count: number;
}
export declare function getUnreadMessage(user_id: string, roomAccess: RoomAccessData): Promise<IUnread>;
export declare class ChatsLogComponent {
    dataListener: DataListener;
    private chatlog_count;
    _isReady: boolean;
    onReady: (rooms: Array<Room>) => void;
    getRoomsInfoCompleteEvent: () => void;
    private chatslog;
    getChatsLog(): Array<ChatLog>;
    private unreadMessageMap;
    getUnreadMessageMap(): UnreadMap;
    setUnreadMessageMap(unreads: Array<IUnread>): void;
    addUnreadMessage(unread: IUnread): void;
    getUnreadItem(room_id: string): IUnread | undefined;
    updatedLastAccessTimeEvent: (data: RoomAccessData) => void;
    onUpdatedLastAccessTime(data: RoomAccessData): void;
    constructor();
    private chatListeners;
    addOnChatListener(listener: any): void;
    onChat(message: MessageImp): void;
    onAccessRoom(dataEvent: StalkAccount): void;
    addNewRoomAccessEvent: (data: any) => void;
    onAddRoomAccess(dataEvent: any): void;
    getUnreadMessages(user_id: string, roomAccess: RoomAccessData[], callback: (err: Error | undefined, logsData: Array<IUnread> | undefined) => void): void;
    getUnreadMessage(user_id: string, roomAccess: RoomAccessData): Promise<IUnread>;
    private decorateRoomInfoData(roomInfo);
    private getRoomInfo(room_id);
    getRoomsInfo(user_id: string, chatrooms: Array<Room>): void;
    manageChatLog(chatrooms: Array<Room>): Promise<ChatLogMap>;
    private organizeChatLogMap(unread, roomInfo, done);
    private setLogProp(log, displayMessage, callback);
    private addChatLog(chatLog, done);
    checkRoomInfo(unread: IUnread, chatrooms: Array<Room>): Promise<{} | undefined>;
    getChatsLogCount(): number;
    increaseChatsLogCount(num: number): void;
    decreaseChatsLogCount(num: number): void;
    calculateChatsLogCount(): void;
}
