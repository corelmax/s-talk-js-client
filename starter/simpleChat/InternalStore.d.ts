export declare type AuthStore = {
    user: {
        _id: string;
        username: string;
    };
    api_token: string;
};
declare const _default: {
    authStore: AuthStore;
    setAuth(newState: AuthStore): void;
};
export default _default;
