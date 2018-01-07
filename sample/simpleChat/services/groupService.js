"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs");
const { ajax } = Rx.Observable;
const ChitChatFactory_1 = require("../ChitChatFactory");
const chitchatServiceUtils_1 = require("./chitchatServiceUtils");
const getConfig = () => ChitChatFactory_1.ChitChatFactory.getInstance().config;
const authReducer = () => ChitChatFactory_1.ChitChatFactory.getInstance().authStore;
function addMember(room_id, member) {
    return ajax({
        method: "POST",
        url: `${getConfig().api.group}/addMember/${room_id}`,
        body: JSON.stringify({ member: member }),
        headers: chitchatServiceUtils_1.apiHeaders()
    });
}
exports.addMember = addMember;
function removeMember(room_id, member_id) {
    return ajax({
        method: "POST",
        url: `${getConfig().api.group}/removeMember/${room_id}`,
        body: JSON.stringify({ member_id: member_id }),
        headers: chitchatServiceUtils_1.withToken(chitchatServiceUtils_1.apiHeaders())(authReducer().chitchat_token)
    });
}
exports.removeMember = removeMember;
