import { MessageImp } from "../models/index";
export declare const decryptionText: (message: MessageImp) => Promise<MessageImp>;
export declare const hashComputation: (message: string) => Promise<string>;
