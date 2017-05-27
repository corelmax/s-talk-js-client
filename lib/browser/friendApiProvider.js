import { ServerImplemented } from "./serverImplemented";
/**
 * FriendApiProvider
 */
export default class FriendApiProvider {
    static getInstance() {
        if (!FriendApiProvider.instance) {
            FriendApiProvider.instance = new FriendApiProvider();
        }
        return FriendApiProvider.instance;
    }
    constructor() {
        console.log("FriendApiProvider constructor");
    }
    friendRequest(token, myId, targetUid, callback) {
        let self = this;
        let msg = {};
        msg["token"] = token;
        msg["targetUid"] = targetUid;
        ServerImplemented.getInstance().pomelo.request("auth.userHandler.addFriend", msg, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
}
