import { ChitChatFactory } from "../ChitChatFactory";
const getConfig = () => ChitChatFactory.getInstance().config;

export const chitchat_headers = () => ({
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "x-api-key": getConfig().api.apiKey,
    "Access-Control-Allow-Credentials": "*",
    "Access-Control-Allow-Origin": "*"
});

export const withToken = (headers) => (token) => {
    headers["x-access-token"] = token;

    return headers;
};