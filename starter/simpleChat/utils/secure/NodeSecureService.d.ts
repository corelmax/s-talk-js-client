import { ISecureService } from "./ISecureService";
export declare class NodeSecureService implements ISecureService {
    key: string;
    passiv: string;
    constructor(secret_key: string);
    hashCompute(content: string): Promise<string>;
    encryption(content: string): Promise<string>;
    decryption(content: string): Promise<string>;
    encryptWithSecureRandom(content: string, callback: (err: Error | undefined, value: string) => void): void;
    decryptWithSecureRandom(content: string): Promise<string>;
}
