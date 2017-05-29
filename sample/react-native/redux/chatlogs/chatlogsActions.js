/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var async = require("async");
var BackendFactory_1 = require("../../chats/BackendFactory");
var chatslogComponent_1 = require("../../chats/chatslogComponent");
var configureStore_1 = require("../configureStore");
var accountService_1 = require("../../servicesAccess/accountService");
exports.STALK_INIT_CHATSLOG = 'STALK_INIT_CHATSLOG';
exports.STALK_GET_CHATSLOG_COMPLETE = 'STALK_GET_CHATSLOG_COMPLETE';
exports.STALK_UNREAD_MAP_CHANGED = 'STALK_UNREAD_MAP_CHANGED';
exports.STALK_CHATSLOG_CONTACT_COMPLETE = 'STALK_CHATSLOG_CONTACT_COMPLETE';
var listenerImp = function (newMsg) {
    var chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    var dataManager = BackendFactory_1.default.getInstance().dataManager;
    if (!dataManager.isMySelf(newMsg.sender)) {
        chatsLogComp.increaseChatsLogCount(1);
        console.warn("room to add: ", JSON.stringify(chatsLogComp.getUnreadItem(newMsg.rid)));
        var unread = new chatslogComponent_1.Unread();
        unread.message = newMsg;
        unread.rid = newMsg.rid;
        var count = (!!chatsLogComp.getUnreadItem(newMsg.rid)) ? chatsLogComp.getUnreadItem(newMsg.rid).count : 0;
        count++;
        unread.count = count;
        chatsLogComp.addUnreadMessage(unread);
        onUnreadMessageMapChanged(unread);
    }
};
function initChatsLog() {
    if (!configureStore_1.default.getState().stalkReducer.isInit) {
        var dataManager = BackendFactory_1.default.getInstance().dataManager;
        var chatsLogComponent_1 = new chatslogComponent_1.default();
        dataManager.contactsProfileChanged = function (contact) {
            chatsLogComponent_1.getRoomsInfo();
        };
        chatsLogComponent_1.onReady = function () {
            getUnreadMessages();
            chatsLogComponent_1.onReady = null;
        };
        chatsLogComponent_1.getRoomsInfoCompleteEvent = function () {
            getChatsLog();
        };
        chatsLogComponent_1.addOnChatListener(listenerImp);
        chatsLogComponent_1.updatedLastAccessTimeEvent = updateLastAccessTimeEventHandler;
        chatsLogComponent_1.addNewRoomAccessEvent = function (data) {
            getUnreadMessages();
        };
        chatsLogComponent_1.onEditedGroupMember = function (newgroup) {
            console.log('onEditedGroupMember: ', JSON.stringify(newgroup));
            // $rootScope.$broadcast('onEditedGroupMember', []);
        };
        var msg_1 = {};
        msg_1["token"] = configureStore_1.default.getState().authReducer.token;
        BackendFactory_1.default.getInstance().getServer().then(function (server) {
            server.getLastAccessRoomsInfo(msg_1, function (err, res) {
                console.log("getLastAccessRoomsInfo:", JSON.stringify(res));
            });
        }).catch(function (err) {
            console.warn("Cannot getLastAccessRoomsInfo", err);
        });
        configureStore_1.default.dispatch({
            type: exports.STALK_INIT_CHATSLOG, payload: chatsLogComponent_1
        });
    }
}
exports.initChatsLog = initChatsLog;
function updateLastAccessTimeEventHandler(newRoomAccess) {
    var chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    var token = configureStore_1.default.getState().authReducer.token;
    chatsLogComp.getUnreadMessage(token, newRoomAccess.roomAccess[0], function (err, unread) {
        if (!!unread) {
            chatsLogComp.addUnreadMessage(unread);
            calculateUnreadCount();
            onUnreadMessageMapChanged(unread);
        }
    });
}
function getUnreadMessages() {
    var chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    var dataManager = BackendFactory_1.default.getInstance().dataManager;
    var token = configureStore_1.default.getState().authReducer.token;
    chatsLogComp.getUnreadMessages(token, dataManager.getRoomAccess(), function done(err, unreadLogs) {
        if (!!unreadLogs) {
            unreadLogs.map(function element(unread) {
                chatsLogComp.addUnreadMessage(unread);
            });
            calculateUnreadCount();
        }
        getUnreadMessageComplete();
    });
}
function calculateUnreadCount() {
    var chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.calculateChatsLogCount();
}
function increaseLogsCount(count) {
    var chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.increaseChatsLogCount(count);
}
function decreaseLogsCount(count) {
    var chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.decreaseChatsLogCount(count);
}
function getChatsLogCount() {
    var chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    return chatsLogComp ? chatsLogComp.getChatsLogCount() : null;
}
exports.getChatsLogCount = getChatsLogCount;
function getUnreadMessageMap() {
    var chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    return chatsLogComp.getUnreadMessageMap();
}
function getChatsLog() {
    var chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    var chatsLog = chatsLogComp.getChatsLog();
    configureStore_1.default.dispatch({
        type: exports.STALK_GET_CHATSLOG_COMPLETE,
        payload: chatsLog
    });
}
function onUnreadMessageMapChanged(unread) {
    console.log('UnreadMessageMapChanged: ', JSON.stringify(unread));
    var chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.checkRoomInfo(unread).then(function () {
        var chatsLog = chatsLogComp.getChatsLog();
        configureStore_1.default.dispatch({
            type: exports.STALK_UNREAD_MAP_CHANGED,
            payload: chatsLog
        });
    }).catch(function () {
        console.warn("Cannot get roomInfo of ", unread.rid);
    });
}
function getUnreadMessageComplete() {
    var chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.getRoomsInfo();
    // $rootScope.$broadcast('getunreadmessagecomplete', {});
}
function getContactOnlineStatus() {
    if (!BackendFactory_1.default.getInstance().stalk._isConnected)
        return;
    var chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    if (!chatsLogComp)
        return;
    var chatsLog = chatsLogComp.getChatsLog();
    var arr_chatsLog = [];
    Object.keys(chatsLog).forEach(function (key) {
        arr_chatsLog.push(chatsLog[key]);
    });
    async.map(arr_chatsLog, function (log, cb) {
        getOnlineStatus(getChatLogContact(log)).then(function (onlineStatus) {
            chatsLog[log.id].contact = onlineStatus;
            cb(null, null);
        }).catch(function (err) { return cb(null, null); });
    }, function (err, results) {
        // console.log("get chatslog contact_status done.", chatsLog);
        configureStore_1.default.dispatch({
            type: exports.STALK_CHATSLOG_CONTACT_COMPLETE,
            payload: chatsLog
        });
    });
}
exports.getContactOnlineStatus = getContactOnlineStatus;
var getOnlineStatus = function (uid) { return __awaiter(_this, void 0, void 0, function () {
    var token, response, value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = configureStore_1.default.getState().authReducer.token;
                return [4 /*yield*/, accountService_1.default.getInstance().getOnlineStatus(uid, token)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                value = _a.sent();
                if (value.success) {
                    return [2 /*return*/, value.result];
                }
                return [2 /*return*/];
        }
    });
}); };
var getChatLogContact = function (chatlog) {
    var dataManager = BackendFactory_1.default.getInstance().dataManager;
    var contacts = chatlog.room.members.filter(function (value) {
        return !dataManager.isMySelf(value.id);
    });
    return (contacts.length > 0) ? contacts[0].id : null;
};
