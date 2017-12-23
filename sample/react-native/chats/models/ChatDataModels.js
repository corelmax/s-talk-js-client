"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RoomType;
(function (RoomType) {
    RoomType[RoomType["organizationGroup"] = 0] = "organizationGroup";
    RoomType[RoomType["projectBaseGroup"] = 1] = "projectBaseGroup";
    RoomType[RoomType["privateGroup"] = 2] = "privateGroup";
    RoomType[RoomType["privateChat"] = 3] = "privateChat";
})(RoomType = exports.RoomType || (exports.RoomType = {}));
;
var RoomStatus;
(function (RoomStatus) {
    RoomStatus[RoomStatus["active"] = 0] = "active";
    RoomStatus[RoomStatus["disable"] = 1] = "disable";
    RoomStatus[RoomStatus["delete"] = 2] = "delete";
})(RoomStatus || (RoomStatus = {}));
;
var Room = /** @class */ (function () {
    function Room() {
        this._visibility = true;
    }
    Object.defineProperty(Room.prototype, "visibility", {
        set: function (_boo) {
            this._visibility = _boo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "visibilty", {
        get: function () {
            return this._visibility;
        },
        enumerable: true,
        configurable: true
    });
    Room.prototype.setName = function (name) {
        this.name = name;
    };
    return Room;
}());
exports.Room = Room;
var MemberRole;
(function (MemberRole) {
    MemberRole[MemberRole["member"] = 0] = "member";
    MemberRole[MemberRole["admin"] = 1] = "admin";
})(MemberRole = exports.MemberRole || (exports.MemberRole = {}));
/**
 * @ ContentType
 */
var ContentType;
(function (ContentType) {
    ContentType[ContentType["Unload"] = 0] = "Unload";
    ContentType[ContentType["File"] = 1] = "File";
    ContentType[ContentType["Text"] = 2] = "Text";
    ContentType[ContentType["Voice"] = 3] = "Voice";
    ContentType[ContentType["Image"] = 4] = "Image";
    ContentType[ContentType["Video"] = 5] = "Video";
    ContentType[ContentType["Sticker"] = 6] = "Sticker";
    ContentType[ContentType["Location"] = 7] = "Location";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
/**
 * @StlakAccount...
 */
var StalkAccount = /** @class */ (function () {
    function StalkAccount() {
    }
    return StalkAccount;
}());
exports.StalkAccount = StalkAccount;
;
