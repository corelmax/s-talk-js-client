"use strict";
var PushDataListener = (function () {
    function PushDataListener() {
        this.onPushEvents = new Array();
    }
    PushDataListener.prototype.addPushEvents = function (fx) {
        this.onPushEvents.push(fx);
    };
    PushDataListener.prototype.removePushEvents = function (fx) {
        var id = this.onPushEvents.indexOf(fx);
        this.onPushEvents.splice(id, 1);
    };
    PushDataListener.prototype.onPush = function (dataEvent) {
        this.onPushEvents.forEach(function (fx) { return fx(dataEvent); });
    };
    return PushDataListener;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PushDataListener;
