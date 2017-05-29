import * as DataModels from "../../chats/models/ChatDataModels";
export declare const STALK_GET_PRIVATE_CHAT_ROOM_ID_REQUEST = "STALK_GET_PRIVATE_CHAT_ROOM_ID_REQUEST";
export declare const STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE = "STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE";
export declare const STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS = "STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS";
export declare function getUserInfo(userId: string, callback: (user: DataModels.ContactInfo) => void): void;
export declare function stalkLogin(uid: string, token: string): void;
export declare function getPrivateChatRoomId(contactId: string): (dispatch: any) => void;
