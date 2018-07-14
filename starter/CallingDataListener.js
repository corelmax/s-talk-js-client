var CallingDataListener = /** @class */ (function () {
    function CallingDataListener() {
        this.onCallListeners = new Array();
    }
    CallingDataListener.createInstance = function () {
        if (!CallingDataListener.instance) {
            CallingDataListener.instance = new CallingDataListener();
        }
        return CallingDataListener.instance;
    };
    CallingDataListener.getInstance = function () {
        return CallingDataListener.instance;
    };
    CallingDataListener.prototype.addOnCallListener = function (fx) {
        this.onCallListeners.push(fx);
    };
    CallingDataListener.prototype.removeOnCallListener = function (fx) {
        var id = this.onCallListeners.indexOf(fx);
        this.onCallListeners.splice(id, 1);
    };
    CallingDataListener.prototype.onCall = function (dataEvent) {
        this.onCallListeners.forEach(function (fx) { return fx(dataEvent); });
    };
    return CallingDataListener;
}());
export { CallingDataListener };
