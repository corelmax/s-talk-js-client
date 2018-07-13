import { ServerImp, IDictionary } from "../ServerImplement";

import { HttpStatusCode, IPomeloResponse } from '../../utils/index';

export class LobbyAPI {
    private server: ServerImp;
    constructor(_server: ServerImp) {
        this.server = _server;
    }

    public checkIn(msg: IDictionary) {
        let self = this;
        let socket = this.server.getSocket();

        return new Promise((resolve, rejected) => {
            // <!-- Authentication.
            socket.request("connector.entryHandler.login", msg, function (res) {
                if (res.code === HttpStatusCode.fail) {
                    rejected(res.message);
                }
                else if (res.code === HttpStatusCode.success) {
                    resolve(res);
                }
                else {
                    resolve(res);
                }
            });
        });
    }

    public logout() {
        let registrationId = "";
        let msg = {} as IDictionary;
        msg["username"] = null;
        msg["registrationId"] = registrationId;

        let socket = this.server.getSocket();
        if (socket != null) {
            socket.notify("connector.entryHandler.logout", msg);
        }

        this.server.disConnect();
        delete this.server;
    }

    /**
     * user : {_id: string, username: string, payload }
     * @param msg 
     */
    async updateUser(msg: IDictionary) {
        let self = this;
        let socket = this.server.getSocket();

        return new Promise((resolve: (value: IPomeloResponse) => void, rejected) => {
            try {
                // <!-- Authentication.
                socket.request("connector.entryHandler.updateUser", msg, (res: IPomeloResponse) => {
                    resolve(res);
                });
            }
            catch (ex) {
                rejected(ex);
            }
        });
    }

    getUsersPayload(msg: IDictionary) {
        let self = this;
        let socket = this.server.getSocket();

        return new Promise((resolve: (value: IPomeloResponse) => void, rejected) => {
            // <!-- Authentication.
            try {
                socket.request("connector.entryHandler.getUsersPayload", msg, (res: IPomeloResponse) => {
                    resolve(res);
                });
            }
            catch (ex) {
                rejected(ex);
            }
        });
    }

    // <!-- Join and leave chat room.
    public joinRoom(token: string, username, room_id: string, callback: (err, res) => void) {
        let self = this;
        let msg = {};
        msg["token"] = token;
        msg["rid"] = room_id;
        msg["username"] = username;

        let socket = this.server.getSocket();
        socket.request("connector.entryHandler.enterRoom", msg, (result: IPomeloResponse) => {
            if (callback !== null) {
                callback(null, result);
            }
        });
    }

    public leaveRoom(token: string, roomId: string, callback: (err, res) => void) {
        let self = this;
        let msg = {};
        msg["token"] = token;
        msg["rid"] = roomId;

        let socket = this.server.getSocket();
        socket.request("connector.entryHandler.leaveRoom", msg, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }

    public kickMeAllSession(uid: string) {
        const self = this;
        let socket = this.server.getSocket();
        if (socket !== null) {
            const msg = { uid };
            socket.request("connector.entryHandler.kickMe", msg, function (result) {
                console.log("kickMe", JSON.stringify(result));
            });
        }
    }
}