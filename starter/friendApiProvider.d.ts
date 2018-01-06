/**
 * FriendApiProvider
 */
export default class FriendApiProvider {
    private static instance;
    static getInstance(): FriendApiProvider;
    constructor();
    friendRequest(token: string, myId: string, targetUid: string, callback: (err, res) => void): void;
}
