export interface IMetaFile {
    thumbnail: string;
    filename: string;
    extension: string;
    fileSize: string;
}
export interface IMessage {
    rid: string;
    content: string;
    sender: string;
    target: string;
    type: string;
    uuid: string;
    mata: IMetaFile;
}
export default class ChatRoomApiProvider {
    pomelo: any;
    constructor(socket: any);
    chat(target: string, _message: IMessage, callback: (err, res) => void): void;
    /**
     * @deprecated please use chat instead.
     */
    chatFile(room_id: string, target: string, sender_id: string, fileUrl: string, contentType: string, meta: any, callback: (err, res) => void): void;
    getSyncDateTime(callback: (err, res) => void): void;
    /**
     * getChatHistory function used for pull history chat record...
     * Beware!!! please call before JoinChatRoom.
     * @param room_id
     * @param lastAccessTime
     * @param callback
     */
    getChatHistory(room_id: string, lastAccessTime: Date, callback: (err, res) => void): void;
    /**
     * get older message histories.
     */
    getOlderMessageChunk(roomId: string, topEdgeMessageTime: Date, callback: (err, res) => void): void;
    checkOlderMessagesCount(roomId: string, topEdgeMessageTime: Date, callback: (err, res) => void): void;
    getMessagesReaders(topEdgeMessageTime: string): void;
    getMessageContent(messageId: string, callback: (err: Error, res: any) => void): void;
    updateMessageReader(messageId: string, roomId: string): void;
    updateMessageReaders(messageIds: string[], roomId: string): void;
}
