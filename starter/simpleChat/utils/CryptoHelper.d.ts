import { MessageImp } from "../models/MessageImp";
export declare const decryptionText: (message: MessageImp) => Promise<MessageImp>;
export declare const hashComputation: (message: any) => Promise<string>;
