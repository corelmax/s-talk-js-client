export default class ChatLog {
    constructor(room) {
        this.id = room._id;
        this.roomName = room.name;
        this.roomType = room.type;
        this.room = room;
    }
    setNotiCount(count) {
        this.count = count;
    }
    setLastMessage(lastMessage) {
        this.lastMessage = lastMessage;
    }
    setLastMessageTime(lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }
}
