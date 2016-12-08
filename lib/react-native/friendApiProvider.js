import Stalk from "./serverImplemented";
/**
 * FriendApiProvider
 */
export default class FriendApiProvider {
    constructor() {
        console.log("FriendApiProvider constructor");
    }
    static getInstance() {
        if (!FriendApiProvider.instance) {
            FriendApiProvider.instance = new FriendApiProvider();
        }
        return FriendApiProvider.instance;
    }
    friendRequest(token, myId, targetUid, callback) {
        console.log('friendRequest', token);
        let self = this;
        let msg = {};
        msg["token"] = token;
        msg["targetUid"] = targetUid;
        Stalk.getInstance().pomelo.request("auth.userHandler.addFriend", msg, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
}
