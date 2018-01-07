import * as UserService from "../../services/UserService";

import { ITeamMember } from "../../models/IteamMember";

import { ChitChatFactory } from "../../ChitChatFactory";
const getTeam = () => ChitChatFactory.getInstance().teamStore;

export async function getContactProfile(userId: string) {
    let members = getTeam().members;

    return new Promise((resolve: (data: ITeamMember) => void, rejected) => {

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
}