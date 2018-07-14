import { ServerImp, IDictionary } from "../ServerImplement";
export declare class ChatRoomAPI {
    private server;
    constructor(_server: ServerImp);
    chat(target: string, _message: any, callback: (err: any, res: any) => void): void;
    pushByUids(_message: IDictionary): Promise<{}>;
    getSyncDateTime(callback: (err: any, res: any) => void): void;
    /**
     * get older message histories.
     */
    getOlderMessageChunk(roomId: string, topEdgeMessageTime: Date, callback: (err: any, res: any) => void): void;
    getMessagesReaders(topEdgeMessageTime: string): void;
    getMessageContent(messageId: string, callback: (err: Error | undefined, res: any) => void): void;
    updateMessageReader(messageId: string, roomId: string): void;
    updateMessageReaders(messageIds: string[], roomId: string): void;
}
