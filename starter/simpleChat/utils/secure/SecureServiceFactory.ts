import { ISecureService } from "./ISecureService";
import { NodeSecureService } from "./NodeSecureService";
/**
 * SecureServiceFactory
 */
export class SecureServiceFactory {
    public static service: ISecureService;
    public static createService(secret_key: string): ISecureService {
        if (!SecureServiceFactory.service)
            SecureServiceFactory.service = new NodeSecureService(secret_key) as ISecureService;

        return SecureServiceFactory.service;
    }
    static getService() {
        return SecureServiceFactory.service;
    }
}
