export declare const FETCH_PRIVATE_CHATROOM = "FETCH_PRIVATE_CHATROOM";
export declare const FETCH_PRIVATE_CHATROOM_FAILURE = "FETCH_PRIVATE_CHATROOM_FAILURE";
export declare const FETCH_PRIVATE_CHATROOM_SUCCESS = "FETCH_PRIVATE_CHATROOM_SUCCESS";
export declare const FETCH_PRIVATE_CHATROOM_CANCELLED = "FETCH_PRIVATE_CHATROOM_CANCELLED";
export declare const fetchPrivateChatRoom: (ownerId: string, roommateId: string) => {
    type: string;
    payload: {
        ownerId: string;
        roommateId: string;
    };
};
export declare const getPrivateChatRoom_Epic: (action$: any) => any;
export declare const CREATE_PRIVATE_CHATROOM = "CREATE_PRIVATE_CHATROOM";
export declare const CREATE_PRIVATE_CHATROOM_SUCCESS = "CREATE_PRIVATE_CHATROOM_SUCCESS";
export declare const CREATE_PRIVATE_CHATROOM_CANCELLED = "CREATE_PRIVATE_CHATROOM_CANCELLED";
export declare const CREATE_PRIVATE_CHATROOM_FAILURE = "CREATE_PRIVATE_CHATROOM_FAILURE";
export declare const createPrivateChatRoom: (owner: any, roommate: any) => {
    type: string;
    payload: {
        owner: any;
        roommate: any;
    };
};
export declare const createPrivateChatRoomEpic: (action$: any) => any;
export declare const GET_MY_ROOM = "GET_MY_ROOM";
export declare const GET_MY_ROOM_SUCCESS = "GET_MY_ROOM_SUCCESS";
export declare const GET_MY_ROOM_FAILURE = "GET_MY_ROOM_FAILURE";
export declare const getMyRoom: any;
export declare const getMyRoomSuccess: any;
export declare const getMyRoomFailure: any;
export declare const getMyRoomEpic: (action$: any) => any;
export declare const GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
export declare const getPersistendMessage: (room_id: string) => Promise<void>;
export declare const UPDATE_MESSAGES_READ = "UPDATE_MESSAGES_READ";
export declare const UPDATE_MESSAGES_READ_SUCCESS = "UPDATE_MESSAGES_READ_SUCCESS";
export declare const UPDATE_MESSAGES_READ_FAILUER = "UPDATE_MESSAGES_READ_FAILURE";
export declare const updateMessagesRead: any;
export declare const updateMessagesRead_Success: any;
export declare const updateMessagesRead_Failure: any;
export declare const updateMessagesRead_Epic: (action$: any) => any;
export declare const CHATROOM_UPLOAD_FILE = "CHATROOM_UPLOAD_FILE";
export declare const CHATROOM_UPLOAD_FILE_SUCCESS = "CHATROOM_UPLOAD_FILE_SUCCESS";
export declare const CHATROOM_UPLOAD_FILE_FAILURE = "CHATROOM_UPLOAD_FILE_FAILURE";
export declare const CHATROOM_UPLOAD_FILE_CANCELLED = "CHATROOM_UPLOAD_FILE_CANCELLED";
export declare const uploadFile: (progressEvent: ProgressEvent, file: any) => {
    type: string;
    payload: {
        data: ProgressEvent;
        file: any;
    };
};
export declare const uploadFileCanceled: () => {
    type: string;
};
export declare const uploadFileEpic: (action$: any) => any;
