import { ISecureService } from "./ISecureService";
/**
 * SecureServiceFactory
 */
export declare class SecureServiceFactory {
    static service: ISecureService;
    static createService(secret_key: string): ISecureService;
    static getService(): ISecureService;
}
