"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeSecureService_1 = require("./NodeSecureService");
/**
 * SecureServiceFactory
 */
class SecureServiceFactory {
    static createService(secret_key) {
        if (!SecureServiceFactory.service)
            SecureServiceFactory.service = new NodeSecureService_1.NodeSecureService(secret_key);
        return SecureServiceFactory.service;
    }
    static getService() {
        return SecureServiceFactory.service;
    }
}
exports.SecureServiceFactory = SecureServiceFactory;
