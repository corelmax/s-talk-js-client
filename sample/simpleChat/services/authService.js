"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("isomorphic-fetch");
const ChitChatFactory_1 = require("../ChitChatFactory");
const chitchatServiceUtils_1 = require("./chitchatServiceUtils");
const getConfig = () => ChitChatFactory_1.ChitChatFactory.getInstance().config;
function auth(user) {
    return fetch(`${getConfig().api.auth}`, {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: user.password }),
        headers: chitchatServiceUtils_1.apiHeaders()
    });
}
exports.auth = auth;
function tokenAuth(token) {
    return fetch(`${getConfig().api.auth}/verify`, {
        method: "POST",
        body: JSON.stringify({ token: token }),
        headers: chitchatServiceUtils_1.apiHeaders()
    });
}
exports.tokenAuth = tokenAuth;
function logout(token) {
    return fetch(`${getConfig().api.auth}/logout`, {
        method: "POST",
        headers: chitchatServiceUtils_1.withToken(chitchatServiceUtils_1.apiHeaders())(token)
    });
}
exports.logout = logout;
function signup(user) {
    return fetch(`${getConfig().api.user}/signup`, {
        method: "POST",
        headers: chitchatServiceUtils_1.apiHeaders(),
        body: JSON.stringify({ user: user })
    });
}
exports.signup = signup;
