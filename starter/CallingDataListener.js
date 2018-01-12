"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CallingDataListener {
    constructor() {
        this.onCallListeners = new Array();
    }
    createInstance() {
        if (!CallingDataListener.instance) {
            CallingDataListener.instance = new CallingDataListener();
        }
        return CallingDataListener.instance;
    }
    getInstance() {
        return CallingDataListener.instance;
    }
    addOnCallListener(fx) {
        this.onCallListeners.push(fx);
    }
    removeOnCallListener(fx) {
        const id = this.onCallListeners.indexOf(fx);
        this.onCallListeners.splice(id, 1);
    }
    onCall(dataEvent) {
        this.onCallListeners.forEach((fx) => fx(dataEvent));
    }
}
exports.CallingDataListener = CallingDataListener;
