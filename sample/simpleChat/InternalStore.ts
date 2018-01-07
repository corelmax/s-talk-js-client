
export type AuthStore = {
    user: { _id: string, username: string };
    api_token: string;
};

export default new class InternalStore {
    authStore: AuthStore;
    setAuth(newState: AuthStore) {
        this.authStore = { ...newState };
    }
}