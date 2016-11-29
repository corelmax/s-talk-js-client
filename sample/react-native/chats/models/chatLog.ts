import * as DataModels from "./ChatDataModels";

export default class ChatLog {
    id: string;
    roomName: string;
    roomType: DataModels.RoomType;
    room: DataModels.Room;
    lastMessageTime: string;
    lastMessage: string;
    count: number;

    constructor(room: DataModels.Room) {
        this.id = room._id;
        this.roomName = room.name;
        this.roomType = room.type;
        this.room = room;
    }

    public setNotiCount(count: number) {
        this.count = count;
    }

    public setLastMessage(lastMessage: string) {
        this.lastMessage = lastMessage;
    }

    public setLastMessageTime(lastMessageTime: string) {
        this.lastMessageTime = lastMessageTime;
    }
}