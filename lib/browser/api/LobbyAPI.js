var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpStatusCode } from '../../utils/index';
export class LobbyAPI {
    constructor(_server) {
        this.server = _server;
    }
    checkIn(msg) {
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
    logout() {
        let registrationId = "";
        let msg = {};
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
    updateUser(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let socket = this.server.getSocket();
            return new Promise((resolve, rejected) => {
                try {
                    // <!-- Authentication.
                    socket.request("connector.entryHandler.updateUser", msg, (res) => {
                        resolve(res);
                    });
                }
                catch (ex) {
                    rejected(ex);
                }
            });
        });
    }
    getUsersPayload(msg) {
        let self = this;
        let socket = this.server.getSocket();
        return new Promise((resolve, rejected) => {
            // <!-- Authentication.
            try {
                socket.request("connector.entryHandler.getUsersPayload", msg, (res) => {
                    resolve(res);
                });
            }
            catch (ex) {
                rejected(ex);
            }
        });
    }
    // <!-- Join and leave chat room.
    joinRoom(token, username, room_id, callback) {
        let self = this;
        let msg = {};
        msg["token"] = token;
        msg["rid"] = room_id;
        msg["username"] = username;
        let socket = this.server.getSocket();
        socket.request("connector.entryHandler.enterRoom", msg, (result) => {
            if (callback !== null) {
                callback(null, result);
            }
        });
    }
    leaveRoom(token, roomId, callback) {
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
    kickMeAllSession(uid) {
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
