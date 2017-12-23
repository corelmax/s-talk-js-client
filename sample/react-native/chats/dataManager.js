"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async = require("async");
var ChatDataModels_1 = require("./models/ChatDataModels");
var SimpleStoreClient_1 = require("../dataAccess/SimpleStoreClient");
var DataManager = /** @class */ (function () {
    function DataManager() {
        this.orgGroups = {};
        this.projectBaseGroups = {};
        this.privateGroups = {};
        this.privateChats = {};
        this.contactsMember = {};
        this.isOrgMembersReady = false;
        this.getContactInfoFailEvents = new Array();
        this.roomDAL = new SimpleStoreClient_1.default("rooms");
    }
    DataManager.prototype.addContactInfoFailEvents = function (func) {
        this.getContactInfoFailEvents.push(func);
    };
    DataManager.prototype.removeContactInfoFailEvents = function (func) {
        var id = this.getContactInfoFailEvents.indexOf(func);
        this.getContactInfoFailEvents.splice(id, 1);
    };
    DataManager.prototype.getSessionToken = function () {
        return this.sessionToken;
    };
    DataManager.prototype.setSessionToken = function (token) {
        this.sessionToken = token;
    };
    //@ Profile...
    DataManager.prototype.getMyProfile = function () {
        return this.myProfile;
    };
    DataManager.prototype.setProfile = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.myProfile = data;
            resolve(_this.myProfile);
        });
    };
    DataManager.prototype.setRoomAccessForUser = function (data) {
        if (!!data.roomAccess) {
            this.myProfile.roomAccess = data.roomAccess;
        }
    };
    DataManager.prototype.updateRoomAccessForUser = function (data) {
        var arr = JSON.parse(JSON.stringify(data.roomAccess));
        if (!this.myProfile) {
            this.myProfile = new ChatDataModels_1.StalkAccount();
            this.myProfile.roomAccess = arr;
        }
        else {
            if (!this.myProfile.roomAccess) {
                this.myProfile.roomAccess = arr;
            }
            else {
                this.myProfile.roomAccess.forEach(function (value) {
                    if (value.roomId === arr[0].roomId) {
                        value.accessTime = arr[0].accessTime;
                        return;
                    }
                });
            }
        }
    };
    DataManager.prototype.getRoomAccess = function () {
        return this.myProfile.roomAccess;
    };
    //<!---------- Group ------------------------------------
    DataManager.prototype.getGroup = function (id) {
        if (!!this.orgGroups[id]) {
            return this.orgGroups[id];
        }
        else if (!!this.projectBaseGroups[id]) {
            return this.projectBaseGroups[id];
        }
        else if (!!this.privateGroups[id]) {
            return this.privateGroups[id];
        }
        else if (!!this.privateChats && !!this.privateChats[id]) {
            return this.privateChats[id];
        }
    };
    DataManager.prototype.addGroup = function (data) {
        switch (data.type) {
            case ChatDataModels_1.RoomType.organizationGroup:
                this.orgGroups[data._id] = data;
                break;
            case ChatDataModels_1.RoomType.projectBaseGroup:
                this.projectBaseGroups[data._id] = data;
                break;
            case ChatDataModels_1.RoomType.privateGroup:
                this.privateGroups[data._id] = data;
                break;
            case ChatDataModels_1.RoomType.privateChat:
                if (!this.privateChats) {
                    this.privateChats = {};
                }
                this.privateChats[data._id] = data;
                break;
            default:
                console.info("new room is not a group type.");
                break;
        }
    };
    DataManager.prototype.updateGroupImage = function (data) {
        if (!!this.orgGroups[data._id]) {
            this.orgGroups[data._id].image = data.image;
        }
        else if (!!this.projectBaseGroups[data._id]) {
            this.projectBaseGroups[data._id].image = data.image;
        }
        else if (!!this.privateGroups[data._id]) {
            this.privateGroups[data._id].image = data.image;
        }
    };
    DataManager.prototype.updateGroupName = function (data) {
        if (!!this.orgGroups[data._id]) {
            this.orgGroups[data._id].name = data.name;
        }
        else if (!!this.projectBaseGroups[data._id]) {
            this.projectBaseGroups[data._id].name = data.name;
        }
        else if (!!this.privateGroups[data._id]) {
            this.privateGroups[data._id].name = data.name;
        }
    };
    DataManager.prototype.updateGroupMembers = function (data) {
        //<!-- Beware please checking myself before update group members.
        //<!-- May be your id is removed from group.
        var hasMe = this.checkMySelfInNewMembersReceived(data);
        if (data.type === ChatDataModels_1.RoomType.organizationGroup) {
            if (!!this.orgGroups[data._id]) {
                //<!-- This statement call when current you still a member.
                if (hasMe) {
                    this.orgGroups[data._id].members = data.members;
                }
                else {
                    console.warn("this org group is not contain me in members list.");
                }
            }
            else {
                this.orgGroups[data._id] = data;
            }
        }
        else if (data.type === ChatDataModels_1.RoomType.projectBaseGroup) {
            if (!!this.projectBaseGroups[data._id]) {
                if (hasMe) {
                    this.projectBaseGroups[data._id].visibility = true;
                    this.projectBaseGroups[data._id].members = data.members;
                }
                else {
                    this.projectBaseGroups[data._id].visibility = false;
                }
            }
            else {
                this.projectBaseGroups[data._id] = data;
            }
        }
        else if (data.type === ChatDataModels_1.RoomType.privateGroup) {
            if (!!this.privateGroups[data._id]) {
                if (hasMe) {
                    this.privateGroups[data._id].visibility = true;
                    this.privateGroups[data._id].members = data.members;
                }
                else {
                    this.privateGroups[data._id].visibility = false;
                }
            }
            else {
                console.debug("new group", data.name);
                this.privateGroups[data._id] = data;
            }
        }
        console.log('dataManager.updateGroupMembers:');
    };
    DataManager.prototype.updateGroupMemberDetail = function (jsonObj) {
        var _this = this;
        var editMember = jsonObj.editMember;
        var roomId = jsonObj.roomId;
        var groupMember = null;
        groupMember.id = editMember.id;
        var role = editMember.role;
        groupMember.role = ChatDataModels_1.MemberRole[role];
        groupMember.jobPosition = editMember.jobPosition;
        this.getGroup(roomId).members.forEach(function (value, index, arr) {
            if (value.id === groupMember.id) {
                _this.getGroup(roomId).members[index].role = groupMember.role;
                _this.getGroup(roomId).members[index].textRole = ChatDataModels_1.MemberRole[groupMember.role];
                _this.getGroup(roomId).members[index].jobPosition = groupMember.jobPosition;
            }
        });
    };
    DataManager.prototype.checkMySelfInNewMembersReceived = function (data) {
        var self = this;
        var hasMe = data.members.some(function isMySelfId(element, index, array) {
            return element.id === self.myProfile._id;
        });
        console.debug("New data has me", hasMe);
        return hasMe;
    };
    //<!------------------------------------------------------
    /**
     * Contacts ....
     */
    DataManager.prototype.onUserLogin = function (dataEvent) {
        console.log("user logedIn", JSON.stringify(dataEvent));
        var jsonObject = JSON.parse(JSON.stringify(dataEvent));
        var _id = jsonObject._id;
        var self = this;
        if (!this.contactsMember)
            this.contactsMember = {};
        if (!this.contactsMember[_id]) {
            //@ Need to get new contact info.
            /*
            ServerImplemented.getInstance().getMemberProfile(_id, (err, res) => {
                console.log("getMemberProfile : ", err, JSON.stringify(res));
    
                let data = JSON.parse(JSON.stringify(res.data));
                let contact: ContactInfo = new ContactInfo();
                contact._id = data._id;
                contact.displayname = data.displayname;
                contact.image = data.image;
                contact.status = data.status;
    
                console.warn(contact);
                self.contactsMember[contact._id] = contact;
    
                if (self.onContactsDataReady != null) {
                    self.onContactsDataReady();
                }
    
                console.log("We need to save contacts list to persistence data layer.");
            });
            */
        }
    };
    DataManager.prototype.updateContactImage = function (contactId, url) {
        if (!!this.contactsMember[contactId]) {
            this.contactsMember[contactId].image = url;
        }
    };
    DataManager.prototype.updateContactProfile = function (contactId, params) {
        if (!!this.contactsMember[contactId]) {
            var jsonObj = JSON.parse(JSON.stringify(params));
            if (!!jsonObj.displayname) {
                this.contactsMember[contactId].displayname = jsonObj.displayname;
            }
            if (!!jsonObj.status) {
                this.contactsMember[contactId].status = jsonObj.status;
            }
        }
    };
    DataManager.prototype.getContactProfile = function (contactId) {
        if (!!this.contactsMember[contactId]) {
            return this.contactsMember[contactId];
        }
        else {
            console.warn('this contactId is invalid. Maybe it not contain in list of contacts.');
            this.getContactInfoFailEvents.forEach(function (value) {
                value(contactId);
            });
        }
    };
    DataManager.prototype.setContactProfile = function (contactId, contact) {
        if (!this.contactsMember)
            this.contactsMember = {};
        if (!this.contactsMember[contactId]) {
            this.contactsMember[contactId] = contact;
            if (!!this.contactsProfileChanged)
                this.contactsProfileChanged(contact);
            console.log("Need to save contacts list to persistence data layer.");
        }
    };
    DataManager.prototype.onGetCompanyMemberComplete = function (dataEvent) {
        var self = this;
        var members = JSON.parse(JSON.stringify(dataEvent));
        if (!this.contactsMember)
            this.contactsMember = {};
        async.eachSeries(members, function iterator(item, cb) {
            if (!self.contactsMember[item._id]) {
                self.contactsMember[item._id] = item;
            }
            cb();
        }, function done(err) {
            self.isOrgMembersReady = true;
        });
        if (this.onContactsDataReady != null)
            this.onContactsDataReady();
    };
    ;
    /**
     * Company...
     */
    DataManager.prototype.onGetCompanyInfo = function (dataEvent) {
    };
    DataManager.prototype.onGetOrganizeGroupsComplete = function (dataEvent) {
        var _this = this;
        var rooms = JSON.parse(JSON.stringify(dataEvent));
        if (!this.orgGroups)
            this.orgGroups = {};
        rooms.forEach(function (value) {
            if (!_this.orgGroups[value._id]) {
                _this.orgGroups[value._id] = value;
            }
        });
        if (this.onOrgGroupDataReady != null) {
            this.onOrgGroupDataReady();
        }
    };
    ;
    DataManager.prototype.onGetProjectBaseGroupsComplete = function (dataEvent) {
        var _this = this;
        var groups = JSON.parse(JSON.stringify(dataEvent));
        if (!this.projectBaseGroups)
            this.projectBaseGroups = {};
        groups.forEach(function (value) {
            if (!_this.projectBaseGroups[value._id]) {
                _this.projectBaseGroups[value._id] = value;
            }
        });
        if (this.onProjectBaseGroupsDataReady != null) {
            this.onProjectBaseGroupsDataReady();
        }
    };
    ;
    DataManager.prototype.onGetPrivateGroupsComplete = function (dataEvent) {
        var _this = this;
        var groups = JSON.parse(JSON.stringify(dataEvent));
        if (!this.privateGroups)
            this.privateGroups = {};
        groups.forEach(function (value) {
            if (!_this.privateGroups[value._id]) {
                _this.privateGroups[value._id] = value;
            }
        });
        if (this.onPrivateGroupsDataReady != null) {
            this.onPrivateGroupsDataReady();
        }
    };
    ;
    DataManager.prototype.onGetMe = function () { };
    DataManager.prototype.isMySelf = function (uid) {
        if (uid === this.myProfile._id)
            return true;
        else
            return false;
    };
    return DataManager;
}());
exports.default = DataManager;
