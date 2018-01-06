export default new class InternalStore {
    setAuth(newState) {
        this.authStore = Object.assign({}, newState);
    }
};
