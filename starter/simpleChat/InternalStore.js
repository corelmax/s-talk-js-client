var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
export default new /** @class */ (function () {
    function InternalStore() {
    }
    InternalStore.prototype.setAuth = function (newState) {
        this.authStore = __assign({}, newState);
    };
    return InternalStore;
}());
