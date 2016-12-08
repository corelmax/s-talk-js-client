"use strict";
class PushDataListener {
    constructor() {
        this.onPushEvents = new Array();
    }
    addPushEvents(fx) {
        this.onPushEvents.push(fx);
    }
    removePushEvents(fx) {
        let id = this.onPushEvents.indexOf(fx);
        this.onPushEvents.splice(id, 1);
    }
    onPush(dataEvent) {
        this.onPushEvents.forEach(fx => fx(dataEvent));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PushDataListener;
