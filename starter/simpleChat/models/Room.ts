export enum MemberRole {
    member = 0,
    admin = 1,
    owner
}
export interface IMembersStatus {
    uid: string;
    status: string;
}
export interface IMember {
    _id: string;
    room_role: MemberRole;
    user_role: string;
    username: string;
    avatar: string;
    joinTime: Date;
    status: string;
}
export enum RoomType {
    organizationGroup, projectBaseGroup, privateGroup, privateChat
};
export enum RoomStatus {
    active, disable, delete
};
export class Room {
    _id: any;
    owner: IMember;
    owner_id: string;
    type: RoomType;
    members: IMember[] | String;
    image: string;
    description: string;
    status: RoomStatus;
    createTime: Date;
    org_chart_id: string;
    team_id: string;
}