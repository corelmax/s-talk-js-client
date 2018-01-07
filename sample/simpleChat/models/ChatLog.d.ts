import { RoomType, Room } from "./Room";
export default class ChatLog {
    id: string;
    roomName: string;
    roomType: RoomType;
    room: Room;
    lastMessageTime: string;
    lastMessage: string;
    count: number;
    constructor(room: Room);
    setNotiCount(count: number): void;
    setLastMessage(lastMessage: string): void;
    setLastMessageTime(lastMessageTime: string): void;
}
