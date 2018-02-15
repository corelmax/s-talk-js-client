export declare const getRoomInfo: (room_id: string) => Promise<any>;
export declare const getUnreadMessage: (room_id: string, user_id: string, lastAccessTime: string) => Promise<any>;
export declare const getOlderMessagesCount: (room_id: string, topEdgeMessageTime: string, queryMessage: boolean) => any;
export declare const getNewerMessages: (room_id: string, lastMessageTime: Date) => any;
export declare const getPrivateChatroom: (ownerId: string, roommateId: string) => any;
