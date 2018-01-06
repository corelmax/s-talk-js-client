import "isomorphic-fetch";
import { ChitChatFactory } from "../ChitChatFactory";
import { withToken, chitchat_headers } from "./chitchatServiceUtils";
const getConfig = () => ChitChatFactory.getInstance().config;
export function auth(user) {
    return fetch(`${getConfig().api.auth}`, {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: user.password }),
        headers: chitchat_headers()
    });
}
export function tokenAuth(token) {
    return fetch(`${getConfig().api.auth}/verify`, {
        method: "POST",
        body: JSON.stringify({ token: token }),
        headers: chitchat_headers()
    });
}
export function logout(token) {
    return fetch(`${getConfig().api.auth}/logout`, {
        method: "POST",
        headers: withToken(chitchat_headers())(token)
    });
}
export function signup(user) {
    return fetch(`${getConfig().api.user}/signup`, {
        method: "POST",
        headers: chitchat_headers(),
        body: JSON.stringify({ user: user })
    });
}
