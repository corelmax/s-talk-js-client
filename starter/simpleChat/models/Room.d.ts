export declare enum MemberRole {
    member = 0,
    admin = 1,
    owner = 2,
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
export declare enum RoomType {
    organizationGroup = 0,
    projectBaseGroup = 1,
    privateGroup = 2,
    privateChat = 3,
}
export declare enum RoomStatus {
    active = 0,
    disable = 1,
    delete = 2,
}
export declare class Room {
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
