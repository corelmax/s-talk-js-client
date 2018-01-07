export interface ISecureService {
    encryption(content: string): Promise<string>;
    decryption(content: string): Promise<string>;
    hashCompute(content: string): Promise<string>;
}
