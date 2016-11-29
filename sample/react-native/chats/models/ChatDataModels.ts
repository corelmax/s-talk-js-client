/**
 * @ Room
 */
type IMembersStatus = {
    uid: string;
    status: string;
}
export enum RoomType { organizationGroup = 0, projectBaseGroup, privateGroup, privateChat };
enum RoomStatus { active, disable, delete };

export class Room {
    _id: string;
    nodeId: number;
    name: string;
    type: RoomType;
    members: Member[];
    image: string;
    description: string;
    status: RoomStatus;
    createTime: Date;

    public _visibility: boolean = true;

    set visibility(_boo: boolean) {
        this._visibility = _boo;
    }
    get visibilty(): boolean {
        return this._visibility;
    }

    public setName(name: string) {
        this.name = name;
    }
}

export type RoomAccessData = {
    roomId: string;
    accessTime: Date;
};

export type Member = {
    id: string;
    role: MemberRole;
    joinTime: string;
    status: string;
    jobPosition: string;
    textRole: string;
}

export enum MemberRole {
    member, admin
}

/**
 * @ ContentType
 */
export enum ContentType {
    Unload,
    File,
    Text,
    Voice,
    Image,
    Video,
    Sticker,
    Location
}

/**
 * @ContactInfo...
 */
export type ContactInfo = {
    _id: string;
    displayname: string;
    status: string;
    image: string;
}

/**
 * @Message...
 */
export type Message = {
    _id: string;
    rid: string;
    type: ContentType;
    body: string;
    sender: string;
    duration: string;
    resolution: string;
    createTime: Date;
    readers: string[];
    meta: MessageMeta;
}
type MessageMeta = {
    duration: string;
    thumbnail: string;
    name: string;
    mimeType: string;
    size: string;
}

/**
 * @StlakAccount...
 */
export class StalkAccount {
    _id: string;
    displayname: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    tel: string;
    mail: string;
    image: string; //!-- mean image url.
    status: string;
    roomAccess: RoomAccessData[];
    memberOfRooms: string[];
    lastEditProfile: Date;
    favoriteUsers: string[]; // user_id
    favoriteGroups: string[]; // room_id
    closedNoticeUsers: string[]; // user_id
    closedNoticeGroups: string[]; // room_id
    deviceTokens: string[];
};