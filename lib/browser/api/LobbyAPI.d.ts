import { ServerImp, IDictionary } from "../ServerImplement";
import { IPomeloResponse } from '../../utils/index';
export declare class LobbyAPI {
    private server;
    constructor(_server: ServerImp);
    checkIn(msg: IDictionary): Promise<{}>;
    logout(): void;
    /**
     * user : {_id: string, username: string, payload }
     * @param msg
     */
    updateUser(msg: IDictionary): Promise<IPomeloResponse>;
    getUsersPayload(msg: IDictionary): Promise<IPomeloResponse>;
    joinRoom(token: string, username: any, room_id: string, callback: (err: any, res: any) => void): void;
    leaveRoom(token: string, roomId: string, callback: (err: any, res: any) => void): void;
    kickMeAllSession(uid: string): void;
}
