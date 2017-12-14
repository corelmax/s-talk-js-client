"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketComponent;
(function (SocketComponent_1) {
    class SocketComponent {
        disconnected(reason) {
            if (!!this.onDisconnect) {
                this.onDisconnect(reason);
            }
            else {
                console.warn("onDisconnected delegate is empty.");
            }
        }
    }
    SocketComponent_1.SocketComponent = SocketComponent;
})(SocketComponent = exports.SocketComponent || (exports.SocketComponent = {}));
