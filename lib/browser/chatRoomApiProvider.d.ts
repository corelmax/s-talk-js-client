import { IPomelo } from "./serverImplemented";
export declare class ChatRoomApiProvider {
    pomelo: IPomelo;
    constructor(socket: any);
    chat(target: string, _message: any, callback: (err, res) => void): void;
    /**
     * @deprecated please use chat instead.
     */
    chatFile(room_id: string, target: string, sender_id: string, fileUrl: string, contentType: string, meta: any, callback: (err, res) => void): void;
    getSyncDateTime(callback: (err, res) => void): void;
    /**
     * get older message histories.
     */
    getOlderMessageChunk(roomId: string, topEdgeMessageTime: Date, callback: (err, res) => void): void;
    getMessagesReaders(topEdgeMessageTime: string): void;
    getMessageContent(messageId: string, callback: (err: Error, res: any) => void): void;
    updateMessageReader(messageId: string, roomId: string): void;
    updateMessageReaders(messageIds: string[], roomId: string): void;
}
