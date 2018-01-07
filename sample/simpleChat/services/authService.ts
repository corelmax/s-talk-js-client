import "isomorphic-fetch";
import { ChitChatFactory } from "../ChitChatFactory";
import { withToken, apiHeaders } from "./chitchatServiceUtils";

const getConfig = () => ChitChatFactory.getInstance().config;

export function auth(user: { email: string, password: string }) {
    return fetch(`${getConfig().api.auth}`, {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: user.password }),
        headers: apiHeaders()
    });
}

export function tokenAuth(token: string) {
    return fetch(`${getConfig().api.auth}/verify`, {
        method: "POST",
        body: JSON.stringify({ token: token }),
        headers: apiHeaders()
    });
}

export function logout(token: string) {
    return fetch(`${getConfig().api.auth}/logout`, {
        method: "POST",
        headers: withToken(apiHeaders())(token)
    });
}

export function signup(user) {
    return fetch(`${getConfig().api.user}/signup`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ user: user })
    });
}