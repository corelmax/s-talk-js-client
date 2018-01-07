export declare const STALK_REMOVE_ROOM_ACCESS = "STALK_REMOVE_ROOM_ACCESS";
export declare const STALK_REMOVE_ROOM_ACCESS_FAILURE = "STALK_REMOVE_ROOM_ACCESS_FAILURE";
export declare const STALK_REMOVE_ROOM_ACCESS_SUCCESS = "STALK_REMOVE_ROOM_ACCESS_SUCCESS";
export declare const STALK_REMOVE_ROOM_ACCESS_CANCELLED = "STALK_REMOVE_ROOM_ACCESS_CANCELLED";
export declare const removeRoomAccess: (room_id: string) => {
    type: string;
    payload: string;
};
export declare const removeRoomAccess_Epic: (action$: any) => any;
export declare const UPDATE_LAST_ACCESS_ROOM_SUCCESS = "UPDATE_LAST_ACCESS_ROOM_SUCCESS";
export declare const UPDATE_LAST_ACCESS_ROOM_FAILURE = "UPDATE_LAST_ACCESS_ROOM_FAILURE";
export declare const updateLastAccessRoom: (room_id: string, user_id: string) => {
    type: string;
    payload: {
        room_id: string;
        user_id: string;
    };
};
export declare const updateLastAccessRoomCancelled: () => {
    type: string;
};
export declare const updateLastAccessRoom_Epic: (action$: any) => any;
export declare const GET_LAST_ACCESS_ROOM = "GET_LAST_ACCESS_ROOM";
export declare const GET_LAST_ACCESS_ROOM_SUCCESS = "GET_LAST_ACCESS_ROOM_SUCCESS";
export declare const GET_LAST_ACCESS_ROOM_FAILURE = "GET_LAST_ACCESS_ROOM_FAILURE";
export declare const getLastAccessRoom: (user_id: string) => {
    type: string;
    payload: {
        user_id: string;
    };
};
export declare const getLastAccessRoom_Epic: (action$: any) => any;
