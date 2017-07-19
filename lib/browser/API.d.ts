import { IDictionary, Stalk } from "./serverImplemented";
export declare namespace API {
    class LobbyAPI {
        private server;
        constructor(_server: Stalk.ServerImplemented);
        checkIn(msg: IDictionary): Promise<{}>;
        logout(): void;
        joinRoom(token: string, username: any, room_id: string, callback: (err, res) => void): void;
        leaveRoom(token: string, roomId: string, callback: (err, res) => void): void;
    }
    class ChatRoomAPI {
        private server;
        constructor(_server: Stalk.ServerImplemented);
        chat(target: string, _message: any, callback: (err, res) => void): void;
        pushByUids(_message: IDictionary): Promise<{}>;
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
    class PushAPI {
        private server;
        constructor(_server: Stalk.ServerImplemented);
        push(_message: IDictionary): Promise<{}>;
    }
    /**
     * calling experiences between phones, apps and VoIP systems
     */
    class CallingAPI {
        private server;
        constructor(_server: Stalk.ServerImplemented);
        calling(api_key: string, event: string, members: string[], payload: any): Promise<{}>;
        theLineIsBusy(contactId: string): Promise<{}>;
    }
}
