"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketComponent;
(function (SocketComponent_1) {
    var SocketComponent = (function () {
        function SocketComponent() {
        }
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
    SocketComponent_1.SocketComponent = SocketComponent;
})(SocketComponent = exports.SocketComponent || (exports.SocketComponent = {}));
