import { SecureServiceFactory } from "../secure/secureServiceFactory";
import { MessageImp } from "../models/MessageImp";
import { MessageType } from "../../shared/Message";

import { ChitChatFactory } from "../ChitChatFactory";
const getConfig = () => ChitChatFactory.getInstance().config;

export const decryptionText = async (message: MessageImp) => {
    if (!message) return message;

    let secure = SecureServiceFactory.getService();

    if (message.type === MessageType[MessageType.Text]) {
        if (getConfig().appConfig.encryption === true) {
            let result = await secure.decryption(message.body);

            message.body = result;
            return message;
        }
        else {
            return message;
        }
    }
    else {
        return message;
    }
};

export const hashComputation = (message): Promise<string> => {
    let secure = SecureServiceFactory.getService();
    return secure.hashCompute(message);
};