var DataListener = /** @class */ (function () {
    function DataListener() {
        var _this = this;
        //#region IServerListener.
        this.activeUserEvents = [];
        this.onRoomAccessEventListeners = new Array();
        this.addOnRoomAccessListener = function (listener) {
            _this.onRoomAccessEventListeners.push(listener);
        };
        this.removeOnRoomAccessListener = function (listener) {
            var id = _this.onRoomAccessEventListeners.indexOf(listener);
            _this.onRoomAccessEventListeners.splice(id, 1);
        };
        this.onAddRoomAccessEventListeners = new Array();
        this.addOnAddRoomAccessListener = function (listener) {
            _this.onAddRoomAccessEventListeners.push(listener);
        };
        this.removeOnAddRoomAccessListener = function (listener) {
            var id = _this.onAddRoomAccessEventListeners.indexOf(listener);
            _this.onAddRoomAccessEventListeners.splice(id, 1);
        };
        this.onUpdateRoomAccessEventListeners = new Array();
        this.addOnUpdateRoomAccessListener = function (listener) {
            _this.onUpdateRoomAccessEventListeners.push(listener);
        };
        this.removeOnUpdateRoomAccessListener = function (listener) {
            var id = _this.onUpdateRoomAccessEventListeners.indexOf(listener);
            _this.onUpdateRoomAccessEventListeners.splice(id, 1);
        };
        //#endregion
        // #region ChatListener...
        this.onChatEventListeners = new Array();
        this.onLeaveRoomListeners = new Array();
        this.activeUserEvents = undefined;
    }
    DataListener.prototype.addActiveUserEventListener = function (listener) {
        if (this.activeUserEvents.indexOf(listener) < 0) {
            this.activeUserEvents.push(listener);
        }
    };
    DataListener.prototype.removeActiveUserEventListener = function (listener) {
        var index = this.activeUserEvents.indexOf(listener);
        this.activeUserEvents.splice(index, 1);
    };
    DataListener.prototype.onActiveUser = function (eventName, data) {
        console.log(eventName, JSON.stringify(data));
        if (this.activeUserEvents && this.activeUserEvents.length > 0) {
            this.activeUserEvents.map(function (listener) {
                listener(eventName, data);
            });
        }
    };
    DataListener.prototype.onUserLogin = function (dataEvent) {
        /*
        console.log("user loged In", JSON.stringify(dataEvent));
        if (this.activeUserEvents && this.activeUserEvents.length) {
            this.activeUserEvents.map(listener => {
                listener(dataEvent);
            });
        }
        */
    };
    DataListener.prototype.onUserLogout = function (dataEvent) {
        /*
        console.log("user loged Out", JSON.stringify(dataEvent));
        if (this.activeUserEvents && this.activeUserEvents.length) {
            this.activeUserEvents.map(listener => {
                listener(dataEvent);
            });
        }
        */
    };
    DataListener.prototype.onAccessRoom = function (dataEvent) {
        if (Array.isArray(dataEvent) && dataEvent.length > 0) {
            var data_1 = dataEvent[0];
            // this.dataManager.setRoomAccessForUser(data);
            this.onRoomAccessEventListeners.map(function (listener) {
                listener(data_1);
            });
        }
    };
    DataListener.prototype.onAddRoomAccess = function (dataEvent) {
        var datas = JSON.parse(JSON.stringify(dataEvent));
        if (!!datas[0].roomAccess && datas[0].roomAccess.length !== 0) {
            // this.dataManager.setRoomAccessForUser(dataEvent);
        }
        this.onAddRoomAccessEventListeners.map(function (value) { return value(dataEvent); });
    };
    DataListener.prototype.onUpdatedLastAccessTime = function (dataEvent) {
        // this.dataManager.updateRoomAccessForUser(dataEvent);
        this.onUpdateRoomAccessEventListeners.map(function (item) { return item(dataEvent); });
    };
    DataListener.prototype.addOnChatListener = function (listener) {
        this.onChatEventListeners.push(listener);
    };
    DataListener.prototype.removeOnChatListener = function (listener) {
        var id = this.onChatEventListeners.indexOf(listener);
        this.onChatEventListeners.splice(id, 1);
    };
    DataListener.prototype.onChat = function (data) {
        var chatMessageImp = data;
        this.onChatEventListeners.map(function (value, id, arr) {
            value(chatMessageImp);
        });
    };
    ;
    DataListener.prototype.addOnLeaveRoomListener = function (listener) {
        this.onLeaveRoomListeners.push(listener);
    };
    DataListener.prototype.removeOnLeaveRoomListener = function (listener) {
        var id = this.onLeaveRoomListeners.indexOf(listener);
        this.onLeaveRoomListeners.splice(id, 1);
    };
    DataListener.prototype.onLeaveRoom = function (data) {
        this.onLeaveRoomListeners.map(function (value) { return value(data); });
    };
    ;
    DataListener.prototype.onRoomJoin = function (data) {
    };
    ;
    return DataListener;
}());
export { DataListener };
