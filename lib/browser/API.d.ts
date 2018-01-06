import { Stalk } from "./ServerImplement";
import { StalkUtils } from '../utils/index';
import { IServer } from "../utils/PomeloUtils";
export declare namespace API {
    class GateAPI {
        private server;
        constructor(_server: Stalk.ServerImplemented);
        gateEnter(msg: Stalk.IDictionary): Promise<IServer>;
    }
    class LobbyAPI {
        private server;
        constructor(_server: Stalk.ServerImplemented);
        checkIn(msg: Stalk.IDictionary): Promise<{}>;
        logout(): void;
        /**
         * user : {_id: string, username: string, payload }
         * @param msg
         */
        updateUser(msg: Stalk.IDictionary): Promise<StalkUtils.IStalkResponse>;
        getUsersPayload(msg: Stalk.IDictionary): Promise<StalkUtils.IStalkResponse>;
        joinRoom(token: string, username: any, room_id: string, callback: (err, res) => void): void;
        leaveRoom(token: string, roomId: string, callback: (err, res) => void): void;
        kickMeAllSession(uid: string): void;
    }
    class ChatRoomAPI {
        private server;
        constructor(_server: Stalk.ServerImplemented);
        chat(target: string, _message: any, callback: (err, res) => void): void;
        pushByUids(_message: Stalk.IDictionary): Promise<{}>;
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
        /**
         * payload: {
         *  event: string;
         *  message: string;
         *  members: string[] | string;
         * }
         *
         * @param {IDictionary} _message
         * @returns
         * @memberof PushAPI
         */
        push(_message: Stalk.IDictionary): Promise<{}>;
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
