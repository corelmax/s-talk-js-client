import { IDictionary, Stalk } from "./serverImplemented";
export declare namespace API {
    class LobbyAPI {
        private server;
        private socket;
        constructor(_server: Stalk.ServerImplemented);
        checkIn(msg: IDictionary): Promise<{}>;
        logout(): void;
        joinRoom(token: string, username: any, room_id: string, callback: (err, res) => void): void;
        leaveRoom(token: string, roomId: string, callback: (err, res) => void): void;
    }
    class ChatRoomAPI {
        private server;
        private socket;
        constructor(_server: Stalk.ServerImplemented);
        chat(target: string, _message: IDictionary, callback: (err, res) => void): void;
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
}
