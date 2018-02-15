import { NodeSecureService } from "./NodeSecureService";
/**
 * SecureServiceFactory
 */
var SecureServiceFactory = /** @class */ (function () {
    function SecureServiceFactory() {
    }
    SecureServiceFactory.createService = function (secret_key) {
        if (!SecureServiceFactory.service)
            SecureServiceFactory.service = new NodeSecureService(secret_key);
        return SecureServiceFactory.service;
    };
    SecureServiceFactory.getService = function () {
        return SecureServiceFactory.service;
    };
    return SecureServiceFactory;
}());
export { SecureServiceFactory };
