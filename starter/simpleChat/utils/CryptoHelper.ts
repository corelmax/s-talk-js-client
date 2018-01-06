import { SecureServiceFactory } from "./secure/SecureServiceFactory";
import { MessageImp } from "../models/index";
import { MessageType } from "../../models/index";

export const decryptionText = async (message: MessageImp) => {
    if (!message) return message;

    let secure = SecureServiceFactory.getService();

    if (message.type === MessageType[MessageType.Text]) {
        let result = await secure.decryption(message.body);
        message.body = result;

        return message;
    }
    else {
        return message;
    }
};

export const hashComputation = (message: string): Promise<string> => {
    let secure = SecureServiceFactory.getService();
    return secure.hashCompute(message);
};