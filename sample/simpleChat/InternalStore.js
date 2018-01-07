"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new class InternalStore {
    setAuth(newState) {
        this.authStore = Object.assign({}, newState);
    }
};
