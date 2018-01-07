import { IMessage } from "stalk-js/starter/models";
import { Room } from "stalk-js/starter/simpleChat/models";
/**
 * ChatRoomActionsType
 */
export declare const REPLACE_MESSAGE = "REPLACE_MESSAGE";
export declare const ON_EARLY_MESSAGE_READY = "ON_EARLY_MESSAGE_READY";
export declare function initChatRoom(currentRoom: Room): void;
export declare const ON_MESSAGE_CHANGED = "ON_MESSAGE_CHANGED";
export declare function checkOlderMessages(): (dispatch: any) => void;
export declare const LOAD_EARLY_MESSAGE_SUCCESS = "LOAD_EARLY_MESSAGE_SUCCESS";
export declare function loadEarlyMessageChunk(room_id: string): (dispatch: any) => void;
export declare const GET_NEWER_MESSAGE = "GET_NEWER_MESSAGE";
export declare const GET_NEWER_MESSAGE_FAILURE = "GET_NEWER_MESSAGE_FAILURE";
export declare const GET_NEWER_MESSAGE_SUCCESS = "GET_NEWER_MESSAGE_SUCCESS";
export declare function getNewerMessageFromNet(): (dispatch: any) => void;
export declare function getMessages(): Promise<any>;
export declare const SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
export declare function sendMessage(message: IMessage): (dispatch: any) => void;
export declare const JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
export declare const JOIN_ROOM_FAILURE = "JOIN_ROOM_FAILURE";
export declare function joinRoom(roomId: string, token: string, username: string): (dispatch: any) => void;
export declare const LEAVE_ROOM = "LEAVE_ROOM";
export declare const LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
export declare function leaveRoomAction(): (dispatch: any) => void;
export declare const DISABLE_CHATROOM = "DISABLE_CHATROOM";
export declare const ENABLE_CHATROOM = "ENABLE_CHATROOM";
export declare const disableChatRoom: () => {
    type: string;
};
export declare const enableChatRoom: () => {
    type: string;
};
export declare const GET_PERSISTEND_CHATROOM = "GET_PERSISTEND_CHATROOM";
export declare const GET_PERSISTEND_CHATROOM_SUCCESS = "GET_PERSISTEND_CHATROOM_SUCCESS";
export declare const GET_PERSISTEND_CHATROOM_FAILURE = "GET_PERSISTEND_CHATROOM_FAILURE";
export declare const getPersistendChatroom: (roomId: string) => (dispatch: any) => any;
export declare const getRoom: (room_id: string) => any;
export declare const createChatRoom: (myUser: any, contactUser: any) => {
    owner: any;
    contact: any;
} | null;
export declare const UPDATED_CHATROOMS = "UPDATED_CHATROOMS";
export declare const updatedChatRoomSuccess: (chatrooms: any[]) => {
    type: string;
    payload: any[];
};
export declare const updateChatRoom: (rooms: any[]) => (dispatch: any) => void;
