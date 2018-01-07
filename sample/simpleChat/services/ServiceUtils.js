"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BackendFactory_1 = require("../../BackendFactory");
const getConfig = () => BackendFactory_1.BackendFactory.getInstance().getApiConfig();
exports.apiHeaders = () => ({
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "x-api-key": getConfig().apiKey,
    "Access-Control-Allow-Credentials": "*",
    "Access-Control-Allow-Origin": "*"
});
exports.withToken = (headers) => (token) => {
    headers["x-access-token"] = token;
    return headers;
};
