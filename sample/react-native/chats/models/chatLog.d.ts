import * as DataModels from "./ChatDataModels";
export default class ChatLog {
    id: string;
    roomName: string;
    roomType: DataModels.RoomType;
    room: DataModels.Room;
    lastMessageTime: string;
    lastMessage: string;
    count: number;
    constructor(room: DataModels.Room);
    setNotiCount(count: number): void;
    setLastMessage(lastMessage: string): void;
    setLastMessageTime(lastMessageTime: string): void;
}
