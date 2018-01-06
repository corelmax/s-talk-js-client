export declare class RoomAccessData {
    roomId: string;
    accessTime: Date;
    constructor(rid: string, time: Date);
}
export interface StalkAccount {
    _id: string;
    username: string;
    roomAccess: Array<RoomAccessData>;
}
