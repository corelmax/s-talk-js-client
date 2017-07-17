/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 * 
 * Ahoo Studio.co.th 
 */
import * as EventEmitter from "events";

import { HttpStatusCode } from '../utils/httpStatusCode';
import { Authen } from '../utils/tokenDecode';
import { API } from './API';
const Pomelo = require("../pomelo/reactWSClient");

export interface IPomelo extends EventEmitter {
    init;
    notify;
    request;
    disconnect;
    setReconnect;
    setInitCallback: (error: string) => void;
};
export interface IServer { host: string; port: number; };
export interface IDictionary { [k: string]: string | any; }

export namespace Stalk {
    export class ServerImplemented {
        private static Instance: ServerImplemented;
        public static getInstance(): ServerImplemented {
            return this.Instance;
        }
        public static createInstance(host: string, port: number): ServerImplemented {
            if (this.Instance === null || this.Instance === undefined) {
                this.Instance = new ServerImplemented(host, port);

                return this.Instance;
            }
        }

        private socket: IPomelo;
        public getSocket() {
            if (this.socket !== null) {
                return this.socket;
            }
            else {
                throw new Error("No socket instance!");
            }
        }
        private lobby: API.LobbyAPI;
        public getLobby() {
            return this.lobby;
        }
        private chatroomAPI: API.ChatRoomAPI;
        public getChatRoomAPI() {
            return this.chatroomAPI;
        }
        private callingAPI: API.CallingAPI;
        public getCallingAPI() {
            return this.callingAPI;
        }

        host: string;
        port: number | string;
        authenData: Stalk.IAuthenData;
        _isConnected = false;
        _isLogedin = false;
        connect = this.connectServer;
        onSocketOpen: (data) => void;
        onSocketClose: (data) => void;
        onSocketReconnect: (data) => void;
        onDisconnected: (data) => void;

        constructor(host: string, port: number) {
            console.log("ServerImp", host, port);

            this.host = host;
            this.port = port;
            this.lobby = new API.LobbyAPI(this);
            this.chatroomAPI = new API.ChatRoomAPI(this);
            this.callingAPI = new API.CallingAPI(this);

            this.connectServer = this.connectServer.bind(this);
            this.listenSocketEvents = this.listenSocketEvents.bind(this);
        }

        public dispose() {
            console.warn("dispose socket client.");

            this.disConnect();

            this.authenData = null;

            ServerImplemented.Instance = null;
        }

        public disConnect(callBack?: Function) {
            let self = this;
            if (!!self.socket) {
                self.socket.removeAllListeners();
                self.socket.disconnect().then(() => {
                    if (callBack) {
                        callBack();
                    }
                });
            }
            else {
                if (callBack) {
                    callBack();
                }
            }
        }

        public init(callback: (err, res: IPomelo) => void) {
            let self = this;
            this._isConnected = false;
            this.socket = Pomelo;

            console.log("stalkInit...");

            if (!!self.socket) {
                // <!-- Connecting gate server.
                let params = { host: self.host, port: self.port, reconnect: false } as ServerParam;
                self.connectServer(params, (err) => {
                    callback(err, self.socket);
                });
            }
            else {
                console.warn("pomelo socket is un ready.");
            }
        }

        private connectServer(params: ServerParam, callback: (err) => void) {
            let self = this;
            this.socket.init(params, function cb(err) {
                console.log("socket init... ", err);
                self.socket.setInitCallback(null);
                callback(err);
            });
        }

        public listenSocketEvents() {
            this.socket.removeAllListeners();

            this.socket.on("onopen", (this.onSocketOpen) ?
                this.onSocketOpen : (data) => console.log("onopen", data));
            this.socket.on("close", (!!this.onSocketClose) ?
                this.onSocketClose : (data) => {
                    console.warn("close", data);
                    this.socket.setInitCallback(null);
                });
            this.socket.on("reconnect", (this.onSocketReconnect) ?
                this.onSocketReconnect : (data) => console.log("reconnect", data));
            this.socket.on("disconnected", (data) => {
                console.warn("disconnected", data);
                this._isConnected = false;
                this.socket.setInitCallback(null);
                if (this.onDisconnected) {
                    this.onDisconnected(data);
                }
            });
            this.socket.on("io-error", (data) => {
                console.warn("io-error", data);
                this.socket.setInitCallback(null);
            });
        }

        // region <!-- Authentication...
        /// <summary>
        /// Connect to gate server then get query of connector server.
        /// </summary>
        public logIn(_username: string, _hash: string, deviceToken: string, callback: (err, res) => void) {
            let self = this;

            if (!!self.socket && this._isConnected === false) {
                let msg = { uid: _username };
                // <!-- Quering connector server.
                self.socket.request("gate.gateHandler.queryEntry", msg, function (result) {

                    console.log("QueryConnectorServ", JSON.stringify(result));

                    if (result.code === HttpStatusCode.success) {
                        self.disConnect();

                        let connectorPort = result.port;
                        // <!-- Connecting to connector server.
                        let params: ServerParam = { host: self.host, port: connectorPort, reconnect: true };
                        self.connectServer(params, (err) => {
                            self._isConnected = true;

                            if (!!err) {
                                callback(err, null);
                            }
                            else {
                                self.authenForFrontendServer(_username, _hash, deviceToken, callback);
                            }
                        });
                    }
                });
            }
            else if (!!self.socket && this._isConnected) {
                self.authenForFrontendServer(_username, _hash, deviceToken, callback);
            }
            else {
                console.warn("pomelo client is null: connecting status %s", this._isConnected);
                console.log("Automatic init pomelo socket...");

                self.init((err, res) => {
                    if (err) {
                        console.warn("Cannot starting pomelo socket!");

                        callback(err, null);
                    }
                    else {
                        console.log("Init socket success.");

                        self.logIn(_username, _hash, deviceToken, callback);
                    }
                });
            }
        }

        // <!-- Authentication. request for token sign.
        private authenForFrontendServer(_username: string, _hash: string, deviceToken: string, callback: (err, res) => void) {
            let self = this;

            let msg = {} as IDictionary;
            msg["email"] = _username;
            msg["password"] = _hash;
            msg["registrationId"] = deviceToken;
            // <!-- Authentication.
            self.socket.request("connector.entryHandler.login", msg, function (res) {
                console.log("login response: ", JSON.stringify(res));

                if (res.code === HttpStatusCode.fail) {
                    if (callback != null) {
                        callback(res.message, null);
                    }
                }
                else if (res.code === HttpStatusCode.success) {
                    if (callback != null) {
                        callback(null, res);
                    }
                }
                else {
                    if (callback !== null) {
                        callback(null, res);
                    }
                }
            });
        }

        gateEnter(msg: IDictionary) {
            let self = this;
            let result = new Promise((resolve: (data: IServer) => void, rejected) => {
                if (!!self.socket && this._isConnected === false) {
                    // <!-- Quering connector server.
                    self.socket.request("gate.gateHandler.queryEntry", msg, function (result) {
                        console.log("gateEnter", result);
                        if (result.code === HttpStatusCode.success) {
                            self.disConnect();

                            let data = { host: self.host, port: result.port };
                            resolve(data);
                        }
                        else {
                            rejected(result);
                        }
                    });
                }
                else {
                    let message = "pomelo client is null: connecting status is " + self._isConnected;
                    console.log("Automatic init pomelo socket...");

                    rejected(message);
                }
            });

            return result;
        }

        public TokenAuthen(tokenBearer: string, checkTokenCallback: (err, res) => void) {
            let self = this;
            let msg = {} as IDictionary;
            msg["token"] = tokenBearer;
            self.socket.request("gate.gateHandler.authenGateway", msg, (result) => {
                this.OnTokenAuthenticate(result, checkTokenCallback);
            });
        }

        private OnTokenAuthenticate(tokenRes: any, onSuccessCheckToken: (err, res) => void) {
            if (tokenRes.code === HttpStatusCode.success) {
                var data = tokenRes.data;
                var decode = data.decoded; //["decoded"];
                var decodedModel = JSON.parse(JSON.stringify(decode)) as Authen.TokenDecoded;
                if (onSuccessCheckToken != null) {
                    onSuccessCheckToken(null, { success: true, username: decodedModel.email, password: decodedModel.password });
                }
            }
            else {
                if (onSuccessCheckToken != null) {
                    onSuccessCheckToken(tokenRes, null);
                }
            }
        }

        public kickMeAllSession(uid: string) {
            let self = this;
            if (self.socket !== null) {
                var msg = { uid: uid };
                self.socket.request("connector.entryHandler.kickMe", msg, function (result) {
                    console.log("kickMe", JSON.stringify(result));
                });
            }
        }

        //<@--- ServerAPIProvider.

        //region <!-- user profile -->

        public UpdateUserProfile(myId: string, profileFields: { [k: string]: string }, callback: (err, res) => void) {
            let self = this;

            profileFields["token"] = this.authenData.token;
            profileFields["_id"] = myId;
            self.socket.request("auth.profileHandler.profileUpdate", profileFields, (result) => {
                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        public ProfileImageChanged(userId: string, path: string, callback: (err, res) => void) {
            let self = this;
            var msg: { [k: string]: string } = {};
            msg["token"] = this.authenData.token;
            msg["userId"] = userId;
            msg["path"] = path;
            self.socket.request("auth.profileHandler.profileImageChanged", msg, (result) => {
                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        public getMe(msg: IDictionary, callback: (err, res) => void) {
            let self = this;
            //<!-- Get user info.
            self.socket.request("connector.entryHandler.getMe", msg, (result) => {
                if (callback !== null) {
                    callback(null, result);
                }
            });
        }

        public updateFavoriteMember(editType: string, member: string, callback: (err, ress) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["editType"] = editType;
            msg["member"] = member;
            msg["token"] = this.authenData.token;
            //<!-- Get user info.
            self.socket.request("auth.profileHandler.editFavoriteMembers", msg, (result) => {
                console.log("updateFavoriteMember: ", JSON.stringify(result));
                callback(null, result);
            });
        }

        public updateFavoriteGroups(editType: string, group: string, callback: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["editType"] = editType;
            msg["group"] = group;
            msg["token"] = this.authenData.token;
            //<!-- Get user info.
            self.socket.request("auth.profileHandler.updateFavoriteGroups", msg, (result) => {
                console.log("updateFavoriteGroups: ", JSON.stringify(result));
                callback(null, result);
            });
        }

        public updateClosedNoticeMemberList(editType: string, member: string, callback: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["editType"] = editType;
            msg["member"] = member;
            msg["token"] = this.authenData.token;
            //<!-- Get user info.
            self.socket.request("auth.profileHandler.updateClosedNoticeUsers", msg, (result) => {
                console.log("updateClosedNoticeUsers: ", JSON.stringify(result));
                callback(null, result);
            });
        }

        public updateClosedNoticeGroupsList(editType: string, group: string, callback: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["editType"] = editType;
            msg["group"] = group;
            msg["token"] = this.authenData.token;
            //<!-- Get user info.
            self.socket.request("auth.profileHandler.updateClosedNoticeGroups", msg, (result) => {
                console.log("updateClosedNoticeGroups: ", JSON.stringify(result));
                callback(null, result);
            });
        }

        public getMemberProfile(userId: string, callback: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["userId"] = userId;

            self.socket.request("auth.profileHandler.getMemberProfile", msg, (result) => {
                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        //endregion


        //region  Company data. 

        /// <summary>
        /// Gets the company info.
        /// Beware for data loading so mush. please load from cache before load from server.
        /// </summary>
        public getCompanyInfo(callBack: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["token"] = this.authenData.token;
            self.socket.request("connector.entryHandler.getCompanyInfo", msg, (result) => {
                if (callBack != null) {
                    callBack(null, result);
                }
            });
        }

        /// <summary>
        /// Gets the company members.
        /// Beware for data loading so mush. please load from cache before load from server.
        /// </summary>
        public getCompanyMembers(callBack: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["token"] = this.authenData.token;
            self.socket.request("connector.entryHandler.getCompanyMember", msg, (result) => {
                console.log("getCompanyMembers", JSON.stringify(result));
                if (callBack != null) {
                    callBack(null, result);
                }
            });
        }

        /// <summary>
        /// Gets the company chat rooms.
        /// Beware for data loading so mush. please load from cache before load from server.
        /// </summary>
        public getOrganizationGroups(callBack: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["token"] = this.authenData.token;
            self.socket.request("connector.entryHandler.getCompanyChatRoom", msg, (result) => {
                console.log("getOrganizationGroups: " + JSON.stringify(result));
                if (callBack != null) {
                    callBack(null, result);
                }
            });
        }

        //endregion


        //region Project base.
        public getProjectBaseGroups(callback: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["token"] = this.authenData.token;
            self.socket.request("connector.entryHandler.getProjectBaseGroups", msg, (result) => {
                console.log("getProjectBaseGroups: " + JSON.stringify(result));
                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        public requestCreateProjectBaseGroup(groupName: string, members: any[], callback: (err, res) => void) {
            let self = this;
            let msg = {} as IDictionary;
            msg["token"] = this.authenData.token;
            msg["groupName"] = groupName;
            msg["members"] = JSON.stringify(members);
            self.socket.request("chat.chatRoomHandler.requestCreateProjectBase", msg, (result) => {
                console.log("requestCreateProjectBaseGroup: " + JSON.stringify(result));
                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        public editMemberInfoInProjectBase(roomId: string, roomType: any, member: any, callback: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["token"] = this.authenData.token;
            msg["roomId"] = roomId;
            msg["roomType"] = roomType.toString();
            msg["member"] = JSON.stringify(member);
            self.socket.request("chat.chatRoomHandler.editMemberInfoInProjectBase", msg, (result) => {
                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        //endregion


        //region <!-- Private Group Room... -->
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

        /// <summary>
        /// Gets the public group chat rooms.
        /// Beware for data loading so mush. please load from cache before load from server.
        /// </summary>
        /// <param name="callback">Callback.</param>

        public getPrivateGroups(callback: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["token"] = this.authenData.token;
            self.socket.request("connector.entryHandler.getMyPrivateGroupChat", msg, (result) => {
                console.log("getPrivateGroups: " + JSON.stringify(result));
                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        public UserRequestCreateGroupChat(groupName: string, memberIds: string[], callback: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["token"] = this.authenData.token;
            msg["groupName"] = groupName;
            msg["memberIds"] = JSON.stringify(memberIds);
            self.socket.request("chat.chatRoomHandler.userCreateGroupChat", msg, (result) => {
                console.log("RequestCreateGroupChat", JSON.stringify(result));

                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        public UpdatedGroupImage(groupId: string, path: string, callback: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["token"] = this.authenData.token;
            msg["groupId"] = groupId;
            msg["path"] = path;
            self.socket.request("chat.chatRoomHandler.updateGroupImage", msg, (result) => {
                console.log("UpdatedGroupImage", JSON.stringify(result));

                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        public editGroupMembers(editType: string, roomId: string, roomType: any, members: string[], callback: (err, res) => void) {
            let self = this;
            if (editType == null || editType.length === 0) return;
            if (roomId == null || roomId.length === 0) return;
            if (roomType === null) return;
            if (members == null || members.length === 0) return;

            var msg = {} as IDictionary;
            msg["token"] = this.authenData.token;
            msg["editType"] = editType;
            msg["roomId"] = roomId;
            msg["roomType"] = roomType.toString();
            msg["members"] = JSON.stringify(members);
            self.socket.request("chat.chatRoomHandler.editGroupMembers", msg, (result) => {
                console.log("editGroupMembers response." + result.toString());

                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        public editGroupName(roomId: string, roomType: any, newGroupName: string, callback: (err, res) => void) {
            let self = this;
            if (roomId == null || roomId.length === 0) return;
            if (roomType === null) return;
            if (newGroupName == null || newGroupName.length === 0) return;

            var msg = {} as IDictionary;
            msg["token"] = this.authenData.token;
            msg["roomId"] = roomId;
            msg["roomType"] = roomType.toString();
            msg["newGroupName"] = newGroupName;
            self.socket.request("chat.chatRoomHandler.editGroupName", msg, (result) => {
                console.log("editGroupName response." + result.toString());

                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        /// <summary>
        /// Gets Private Chat Room.
        /// </summary>
        /// <param name="myId">My identifier.</param>
        /// <param name="myRoommateId">My roommate identifier.</param>
        public getPrivateChatRoomId(token: string, myId: string, myRoommateId: string, callback: (err, res) => void) {
            let self = this;
            var msg = {} as IDictionary;
            msg["token"] = token;
            msg["ownerId"] = myId;
            msg["roommateId"] = myRoommateId;
            self.socket.request("chat.chatRoomHandler.getRoomById", msg, (result) => {
                if (callback != null) {
                    callback(null, result);
                }
            });
        }

        //endregion
    }
    export interface IAuthenData {
        userId: string;
        token: string;
    }
    export class ServerParam implements IServer {
        host: string;
        port: number;
        reconnect: boolean;
    }
}
