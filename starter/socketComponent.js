"use strict";
var SocketComponent = /** @class */ (function () {
    function SocketComponent() {
    }
    SocketComponent.prototype.onDisconnect = function (reason) {
    };
    SocketComponent.prototype.disconnected = function (reason) {
        if (!!this.onDisconnect) {
            this.onDisconnect(reason);
        }
        else {
            console.warn("onDisconnected delegate is empty.");
        }
    };
    return SocketComponent;
}());
