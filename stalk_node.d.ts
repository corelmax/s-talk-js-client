import ServerImp, { IDictionary } from "./lib/node/serverImplemented";
export declare type Dict = IDictionary;
export declare type Stalk = ServerImp;
export declare function init(): any;
/**
 * For test call api omly...
 */
export declare function testCall(): void;
export declare function push(msg: IDictionary): void;
