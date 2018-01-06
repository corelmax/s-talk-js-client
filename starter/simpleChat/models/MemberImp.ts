import { IMember } from "./Room";

export class MemberImp implements IMember {
    _id: string;
    username: string;
    avatar: string;
    joinTime: any;
    status: any;
    room_role: any;
    user_role: string;
    jobPosition: string;
}