"use strict";
(function (RoomType) {
    RoomType[RoomType["organizationGroup"] = 0] = "organizationGroup";
    RoomType[RoomType["projectBaseGroup"] = 1] = "projectBaseGroup";
    RoomType[RoomType["privateGroup"] = 2] = "privateGroup";
    RoomType[RoomType["privateChat"] = 3] = "privateChat";
})(exports.RoomType || (exports.RoomType = {}));
var RoomType = exports.RoomType;
;
var RoomStatus;
(function (RoomStatus) {
    RoomStatus[RoomStatus["active"] = 0] = "active";
    RoomStatus[RoomStatus["disable"] = 1] = "disable";
    RoomStatus[RoomStatus["delete"] = 2] = "delete";
})(RoomStatus || (RoomStatus = {}));
;
class Room {
    constructor() {
        this._visibility = true;
    }
    set visibility(_boo) {
        this._visibility = _boo;
    }
    get visibilty() {
        return this._visibility;
    }
    setName(name) {
        this.name = name;
    }
}
exports.Room = Room;
(function (MemberRole) {
    MemberRole[MemberRole["member"] = 0] = "member";
    MemberRole[MemberRole["admin"] = 1] = "admin";
})(exports.MemberRole || (exports.MemberRole = {}));
var MemberRole = exports.MemberRole;
/**
 * @ ContentType
 */
(function (ContentType) {
    ContentType[ContentType["Unload"] = 0] = "Unload";
    ContentType[ContentType["File"] = 1] = "File";
    ContentType[ContentType["Text"] = 2] = "Text";
    ContentType[ContentType["Voice"] = 3] = "Voice";
    ContentType[ContentType["Image"] = 4] = "Image";
    ContentType[ContentType["Video"] = 5] = "Video";
    ContentType[ContentType["Sticker"] = 6] = "Sticker";
    ContentType[ContentType["Location"] = 7] = "Location";
})(exports.ContentType || (exports.ContentType = {}));
var ContentType = exports.ContentType;
/**
 * @StlakAccount...
 */
class StalkAccount {
}
exports.StalkAccount = StalkAccount;
;
