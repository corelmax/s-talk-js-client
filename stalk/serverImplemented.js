/**
 * Stalk-JavaScript, Node.js client. Supported react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
import HttpStatusCode from './utils/httpStatusCode';
const Pomelo = require('../pomelo/webSocketClient');
import Config from '../../configs/config';
class AuthenData {
}
export default class ServerImplemented {
    constructor() {
        this._isConnected = false;
        this._isLogedin = false;
        this.username = "";
        this.password = "";
        this.connect = this.connectServer;
        console.log("serv imp. constructor");
    }
    static getInstance() {
        if (this.Instance === null || this.Instance === undefined) {
            this.Instance = new ServerImplemented();
        }
        return this.Instance;
    }
    setSocketComponent(socket) {
        this.socketComponent = socket;
    }
    getClient() {
        var self = this;
        if (self.pomelo !== null) {
            return self.pomelo;
        }
        else {
            console.warn("disconnected.");
        }
    }
    dispose() {
        console.warn("dispose socket client.");
        this.disConnect();
        this.authenData = null;
        ServerImplemented.Instance = null;
    }
    disConnect() {
        let self = this;
        console.log('disconnecting...');
        if (!!self.pomelo) {
            self.pomelo.removeAllListeners();
            self.pomelo.disconnect();
        }
    }
    logout() {
        console.log('logout request', this.username);
        let self = this;
        var registrationId = "";
        var msg = {};
        msg["username"] = this.username;
        msg["registrationId"] = registrationId;
        if (self.pomelo != null)
            self.pomelo.notify("connector.entryHandler.logout", msg);
        this.disConnect();
        self.pomelo = null;
    }
    init(callback) {
        console.log('serverImp.init()');
        let self = this;
        this._isConnected = false;
        self.pomelo = Pomelo;
        self.host = Config.Stalk.chat;
        self.port = parseInt(Config.Stalk.port);
        if (!!self.pomelo) {
            //<!-- Connecting gate server.
            self.connectServer(self.host, self.port, (err) => {
                callback(err, self);
            });
        }
        else {
            console.warn("pomelo socket is un ready.");
        }
    }
    connectServer(_host, _port, callback) {
        let self = this;
        console.log("socket connecting to: ", _host, _port);
        self.pomelo.init({ host: _host, port: _port }, function cb(err) {
            console.log("socket init result: ", err);
            callback(err);
        });
    }
    // region <!-- Authentication...
    /// <summary>
    /// Connect to gate server then get query of connector server.
    /// </summary>
    logIn(_username, _hash, deviceToken, callback) {
        let self = this;
        this.username = _username;
        this.password = _hash;
        if (!!self.pomelo && this._isConnected === false) {
            let msg = { uid: self.username };
            //<!-- Quering connector server.
            self.pomelo.request("gate.gateHandler.queryEntry", msg, function (result) {
                console.log("QueryConnectorServ", JSON.stringify(result));
                if (result.code === HttpStatusCode.success) {
                    self.disConnect();
                    let connectorPort = result.port;
                    //<!-- Connecting to connector server.
                    self.connectServer(self.host, connectorPort, (err) => {
                        self._isConnected = true;
                        if (!!err) {
                            callback(err, null);
                        }
                        else {
                            self.authenForFrontendServer(deviceToken, callback);
                        }
                    });
                }
            });
        }
        else if (!!self.pomelo && this._isConnected) {
            self.authenForFrontendServer(deviceToken, callback);
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
                    self.logIn(this.username, this.password, deviceToken, callback);
                }
            });
        }
    }
    //<!-- Authentication. request for token sign.
    authenForFrontendServer(deviceToken, callback) {
        let self = this;
        let msg = {};
        msg["email"] = self.username;
        msg["password"] = self.password;
        msg["registrationId"] = deviceToken;
        //<!-- Authentication.
        self.pomelo.request("connector.entryHandler.login", msg, function (res) {
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
                self.pomelo.on('disconnect', function data(reason) {
                    self._isConnected = false;
                    if (self.socketComponent !== null)
                        self.socketComponent.disconnected(reason);
                });
            }
            else {
                if (callback !== null) {
                    callback(null, res);
                }
            }
        });
    }
    gateEnter(uid) {
        let self = this;
        let msg = { uid: uid };
        return new Promise((resolve, rejected) => {
            if (!!self.pomelo && this._isConnected === false) {
                //<!-- Quering connector server.
                self.pomelo.request("gate.gateHandler.queryEntry", msg, function (result) {
                    console.log("gateEnter", JSON.stringify(result));
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
                let message = "pomelo client is null: connecting status is" + self._isConnected;
                console.log("Automatic init pomelo socket...");
                rejected(message);
            }
        });
    }
    connectorEnter(msg) {
        let self = this;
        return new Promise((resolve, rejected) => {
            //<!-- Authentication.
            self.pomelo.request("connector.entryHandler.login", msg, function (res) {
                if (res.code === HttpStatusCode.fail) {
                    rejected(res.message);
                }
                else if (res.code === HttpStatusCode.success) {
                    resolve(res);
                    self.pomelo.on('disconnect', function data(reason) {
                        self._isConnected = false;
                        if (self.socketComponent !== null)
                            self.socketComponent.disconnected(reason);
                    });
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    TokenAuthen(tokenBearer, checkTokenCallback) {
        let self = this;
        var msg = {};
        msg["token"] = tokenBearer;
        self.pomelo.request("gate.gateHandler.authenGateway", msg, (result) => {
            this.OnTokenAuthenticate(result, checkTokenCallback);
        });
    }
    OnTokenAuthenticate(tokenRes, onSuccessCheckToken) {
        if (tokenRes.code === HttpStatusCode.success) {
            var data = tokenRes.data;
            var decode = data.decoded; //["decoded"];
            var decodedModel = JSON.parse(JSON.stringify(decode));
            if (onSuccessCheckToken != null)
                onSuccessCheckToken(null, { success: true, username: decodedModel.email, password: decodedModel.password });
        }
        else {
            if (onSuccessCheckToken != null)
                onSuccessCheckToken(tokenRes, null);
        }
    }
    kickMeAllSession(uid) {
        let self = this;
        if (self.pomelo !== null) {
            var msg = { uid: uid };
            self.pomelo.request("connector.entryHandler.kickMe", msg, function (result) {
                console.log("kickMe", JSON.stringify(result));
            });
        }
    }
    //<@--- ServerAPIProvider.
    //region <!-- user profile -->
    UpdateUserProfile(myId, profileFields, callback) {
        let self = this;
        profileFields["token"] = this.authenData.token;
        profileFields["_id"] = myId;
        self.pomelo.request("auth.profileHandler.profileUpdate", profileFields, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    ProfileImageChanged(userId, path, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["userId"] = userId;
        msg["path"] = path;
        self.pomelo.request("auth.profileHandler.profileImageChanged", msg, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    getLastAccessRoomsInfo(callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        //<!-- Get user info.
        self.pomelo.request("connector.entryHandler.getLastAccessRooms", msg, (result) => {
            if (callback !== null) {
                callback(null, result);
            }
        });
    }
    getMe(callback) {
        let self = this;
        var msg = {};
        msg["username"] = self.username;
        msg["password"] = self.password;
        msg["token"] = this.authenData.token;
        //<!-- Get user info.
        self.pomelo.request("connector.entryHandler.getMe", msg, (result) => {
            console.log("getMe: ", JSON.stringify(result.code));
            if (callback !== null) {
                callback(null, result);
            }
        });
    }
    updateFavoriteMember(editType, member, callback) {
        let self = this;
        var msg = {};
        msg["editType"] = editType;
        msg["member"] = member;
        msg["token"] = this.authenData.token;
        //<!-- Get user info.
        self.pomelo.request("auth.profileHandler.editFavoriteMembers", msg, (result) => {
            console.log("updateFavoriteMember: ", JSON.stringify(result));
            callback(null, result);
        });
    }
    updateFavoriteGroups(editType, group, callback) {
        let self = this;
        var msg = {};
        msg["editType"] = editType;
        msg["group"] = group;
        msg["token"] = this.authenData.token;
        //<!-- Get user info.
        self.pomelo.request("auth.profileHandler.updateFavoriteGroups", msg, (result) => {
            console.log("updateFavoriteGroups: ", JSON.stringify(result));
            callback(null, result);
        });
    }
    updateClosedNoticeMemberList(editType, member, callback) {
        let self = this;
        var msg = {};
        msg["editType"] = editType;
        msg["member"] = member;
        msg["token"] = this.authenData.token;
        //<!-- Get user info.
        self.pomelo.request("auth.profileHandler.updateClosedNoticeUsers", msg, (result) => {
            console.log("updateClosedNoticeUsers: ", JSON.stringify(result));
            callback(null, result);
        });
    }
    updateClosedNoticeGroupsList(editType, group, callback) {
        let self = this;
        var msg = {};
        msg["editType"] = editType;
        msg["group"] = group;
        msg["token"] = this.authenData.token;
        //<!-- Get user info.
        self.pomelo.request("auth.profileHandler.updateClosedNoticeGroups", msg, (result) => {
            console.log("updateClosedNoticeGroups: ", JSON.stringify(result));
            callback(null, result);
        });
    }
    getMemberProfile(userId, callback) {
        let self = this;
        var msg = {};
        msg["userId"] = userId;
        self.pomelo.request("auth.profileHandler.getMemberProfile", msg, (result) => {
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
    getCompanyInfo(callBack) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        self.pomelo.request("connector.entryHandler.getCompanyInfo", msg, (result) => {
            if (callBack != null)
                callBack(null, result);
        });
    }
    /// <summary>
    /// Gets the company members.
    /// Beware for data loading so mush. please load from cache before load from server.
    /// </summary>
    getCompanyMembers(callBack) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        self.pomelo.request("connector.entryHandler.getCompanyMember", msg, (result) => {
            console.log("getCompanyMembers", JSON.stringify(result));
            if (callBack != null)
                callBack(null, result);
        });
    }
    /// <summary>
    /// Gets the company chat rooms.
    /// Beware for data loading so mush. please load from cache before load from server.
    /// </summary>
    getOrganizationGroups(callBack) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        self.pomelo.request("connector.entryHandler.getCompanyChatRoom", msg, (result) => {
            console.log("getOrganizationGroups: " + JSON.stringify(result));
            if (callBack != null)
                callBack(null, result);
        });
    }
    //endregion
    //region Project base.
    getProjectBaseGroups(callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        self.pomelo.request("connector.entryHandler.getProjectBaseGroups", msg, (result) => {
            console.log("getProjectBaseGroups: " + JSON.stringify(result));
            if (callback != null)
                callback(null, result);
        });
    }
    requestCreateProjectBaseGroup(groupName, members, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["groupName"] = groupName;
        msg["members"] = JSON.stringify(members);
        self.pomelo.request("chat.chatRoomHandler.requestCreateProjectBase", msg, (result) => {
            console.log("requestCreateProjectBaseGroup: " + JSON.stringify(result));
            if (callback != null)
                callback(null, result);
        });
    }
    editMemberInfoInProjectBase(roomId, roomType, member, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["roomId"] = roomId;
        msg["roomType"] = roomType.toString();
        msg["member"] = JSON.stringify(member);
        self.pomelo.request("chat.chatRoomHandler.editMemberInfoInProjectBase", msg, (result) => {
            if (callback != null)
                callback(null, result);
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
    getPrivateGroups(callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        self.pomelo.request("connector.entryHandler.getMyPrivateGroupChat", msg, (result) => {
            console.log("getPrivateGroups: " + JSON.stringify(result));
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    UserRequestCreateGroupChat(groupName, memberIds, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["groupName"] = groupName;
        msg["memberIds"] = JSON.stringify(memberIds);
        self.pomelo.request("chat.chatRoomHandler.userCreateGroupChat", msg, (result) => {
            console.log("RequestCreateGroupChat", JSON.stringify(result));
            if (callback != null)
                callback(null, result);
        });
    }
    UpdatedGroupImage(groupId, path, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["groupId"] = groupId;
        msg["path"] = path;
        self.pomelo.request("chat.chatRoomHandler.updateGroupImage", msg, (result) => {
            console.log("UpdatedGroupImage", JSON.stringify(result));
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    editGroupMembers(editType, roomId, roomType, members, callback) {
        let self = this;
        if (editType == null || editType.length === 0)
            return;
        if (roomId == null || roomId.length === 0)
            return;
        if (roomType === null)
            return;
        if (members == null || members.length === 0)
            return;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["editType"] = editType;
        msg["roomId"] = roomId;
        msg["roomType"] = roomType.toString();
        msg["members"] = JSON.stringify(members);
        self.pomelo.request("chat.chatRoomHandler.editGroupMembers", msg, (result) => {
            console.log("editGroupMembers response." + result.toString());
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    editGroupName(roomId, roomType, newGroupName, callback) {
        let self = this;
        if (roomId == null || roomId.length === 0)
            return;
        if (roomType === null)
            return;
        if (newGroupName == null || newGroupName.length === 0)
            return;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["roomId"] = roomId;
        msg["roomType"] = roomType.toString();
        msg["newGroupName"] = newGroupName;
        self.pomelo.request("chat.chatRoomHandler.editGroupName", msg, (result) => {
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
    getPrivateChatRoomId(token, myId, myRoommateId, callback) {
        let self = this;
        var msg = {};
        msg["token"] = token;
        msg["ownerId"] = myId;
        msg["roommateId"] = myRoommateId;
        self.pomelo.request("chat.chatRoomHandler.getRoomById", msg, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    //<!-- Join and leave chat room.
    JoinChatRoomRequest(token, username, room_id, callback) {
        let self = this;
        let msg = {};
        msg["token"] = token;
        msg["rid"] = room_id;
        msg["username"] = username;
        self.pomelo.request("connector.entryHandler.enterRoom", msg, (result) => {
            console.log("JoinChatRoom: " + JSON.stringify(result));
            if (callback !== null) {
                callback(null, result);
            }
        });
    }
    LeaveChatRoomRequest(token, roomId, username, callback) {
        let self = this;
        var msg = {};
        msg["token"] = token;
        msg["rid"] = roomId;
        msg["username"] = username;
        self.pomelo.request("connector.entryHandler.leaveRoom", msg, (result) => {
            if (callback != null)
                callback(null, result);
        });
    }
    /// <summary>
    /// Gets the room info. For load Room info by room_id.
    /// </summary>
    /// <c> return data</c>
    getRoomInfo(roomId, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["roomId"] = roomId;
        self.pomelo.request("chat.chatRoomHandler.getRoomInfo", msg, (result) => {
            if (callback != null)
                callback(null, result);
        });
    }
    getUnreadMsgOfRoom(roomId, lastAccessTime, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["roomId"] = roomId;
        msg["lastAccessTime"] = lastAccessTime;
        self.pomelo.request("chat.chatRoomHandler.getUnreadRoomMessage", msg, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    //endregion
    // region <!-- Web RTC Calling...
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// <summary>
    /// Videos the call requesting.
    /// - tell target client for your call requesting...
    /// </summary>
    videoCallRequest(targetId, myRtcId, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["targetId"] = targetId;
        msg["myRtcId"] = myRtcId;
        self.pomelo.request("connector.entryHandler.videoCallRequest", msg, (result) => {
            console.log("videoCallRequesting =>: " + JSON.stringify(result));
            if (callback != null)
                callback(null, result);
        });
    }
    voiceCallRequest(targetId, myRtcId, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["targetId"] = targetId;
        msg["myRtcId"] = myRtcId;
        self.pomelo.request("connector.entryHandler.voiceCallRequest", msg, (result) => {
            console.log("voiceCallRequesting =>: " + JSON.stringify(result));
            if (callback != null)
                callback(null, result);
        });
    }
    hangupCall(myId, contactId) {
        let self = this;
        var msg = {};
        msg["userId"] = myId;
        msg["contactId"] = contactId;
        msg["token"] = this.authenData.token;
        self.pomelo.request("connector.entryHandler.hangupCall", msg, (result) => {
            console.log("hangupCall: ", JSON.stringify(result));
        });
    }
    theLineIsBusy(contactId) {
        let self = this;
        var msg = {};
        msg["contactId"] = contactId;
        self.pomelo.request("connector.entryHandler.theLineIsBusy", msg, (result) => {
            console.log("theLineIsBusy response: " + JSON.stringify(result));
        });
    }
}
ServerImplemented.connectionProblemString = 'Server connection is unstable.';
