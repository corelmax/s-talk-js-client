import { Room } from "../../chats/models/ChatDataModels";
/**
 * ChatRoomActionsType
 */
export declare class ChatRoomActionsType {
    static STOP: string;
    static GET_PERSISTEND_MESSAGE_REQUEST: string;
    static GET_PERSISTEND_MESSAGE_SUCCESS: string;
    static GET_PERSISTEND_MESSAGE_FAILURE: string;
    static GET_NEWER_MESSAGE_FAILURE: string;
    static GET_NEWER_MESSAGE_SUCCESS: string;
    static SEND_MESSAGE_REQUEST: string;
    static SEND_MESSAGE_SUCCESS: string;
    static SEND_MESSAGE_FAILURE: string;
    static JOIN_ROOM_REQUEST: string;
    static JOIN_ROOM_SUCCESS: string;
    static JOIN_ROOM_FAILURE: string;
    static REPLACE_MESSAGE: string;
    static ON_NEW_MESSAGE: string;
    static ON_EARLY_MESSAGE_READY: string;
    static LOAD_EARLY_MESSAGE_SUCCESS: string;
    static SELECT_CHAT_ROOM: string;
}
export declare function stop(): (dispatch: any) => {
    type: string;
};
export declare function initChatRoom(currentRoom: Room): (dispatch: any) => void;
export declare function getPersistendMessage(currentRid: string): (dispatch: any) => void;
export declare function checkOlderMessages(): (dispatch: any) => void;
export declare function getNewerMessageFromNet(): (dispatch: any) => void;
export declare function sendMessage(message: any): (dispatch: any) => void;
export declare function sendFile(message: any): (dispatch: any) => void;
export declare function joinRoom(roomId: string, token: string, username: string): (dispatch: any) => void;
export declare function leaveRoom(): (dispatch: any) => void;
export declare function loadEarlyMessageChunk(): (dispatch: any) => void;
export declare function selectRoom(roomInfo?: Room): {
    type: string;
    payload: Room | undefined;
};
