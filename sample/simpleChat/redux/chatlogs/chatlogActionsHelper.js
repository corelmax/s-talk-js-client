"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChitChatFactory_1 = require("../../ChitChatFactory");
const getTeam = () => ChitChatFactory_1.ChitChatFactory.getInstance().teamStore;
function getContactProfile(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let members = getTeam().members;
        return new Promise((resolve, rejected) => {
            if (!members || members.length <= 0) {
                return rejected("No have members");
            }
            let users = members.filter(value => {
                return value._id == userId;
            });
            if (users.length > 0) {
                let user = users[0];
                resolve(user);
            }
            else {
                rejected("No implemented functions");
                // UserService.getUserInfo(userId)
                //     .then(result => result.json())
                //     .then(result => {
                //         console.log("getUserInfo value", result);
                //         if (result.success) {
                //             let user = result.data[0];
                //             let contact: ContactInfo = {
                //                 _id: user._id, displayname: `${user.first_name} ${user.last_name}`, status: "", image: user.avatar
                //             };
                //             dataManager.setContactProfile(user._id, contact);
                //             resolve(contact);
                //         }
                //         else {
                //             dataManager.setContactProfile(userId, {} as ContactInfo);
                //             rejected(result.message);
                //         }
                //     }).catch(err => {
                //         console.warn("getUserInfo fail", err);
                //         rejected(err);
                //     });
            }
        });
    });
}
exports.getContactProfile = getContactProfile;
