export class RoomAccessData {
    roomId: string;
    accessTime: Date;

    constructor(rid: string, time: Date) {
        this.roomId = rid;
        this.accessTime = time;
    }
};

export interface StalkAccount {
    _id: string;
    username: string;
    roomAccess: Array<RoomAccessData>;
}