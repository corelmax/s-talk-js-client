/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th
 */
import { ServerImplement, IDictionary } from "./lib/node/ServerImplement";
export declare type Dict = IDictionary;
export declare type Stalk = ServerImplement;
export declare function init(): Promise<void>;
/**
 * For test call api omly...
 */
export declare function testCall(): void;
export declare function push(msg: IDictionary): void;
