/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th
 */
export { Stalk, IPomelo, IServer, IDictionary } from "./lib/browser/serverImplemented";
export * from "./lib/browser/StalkEvents";
export * from "./lib/browser/API";
import { HttpStatusCode } from "./lib/utils/httpStatusCode";
import { Authen } from "./lib/utils/tokenDecode";
import { Stalk, IPomelo, IServer, IDictionary } from "./lib/browser/serverImplemented";
export declare namespace stalkjs {
    module Utils {
        var statusCode: typeof HttpStatusCode;
        var tokenDecode: typeof Authen.TokenDecoded;
    }
    function create(_host: string, _port: number): Stalk.ServerImplemented;
    function init(server: Stalk.ServerImplemented): Promise<IPomelo>;
    function geteEnter(server: Stalk.ServerImplemented, message: IDictionary): Promise<IServer>;
    function handshake(server: Stalk.ServerImplemented, params: Stalk.ServerParam): Promise<IPomelo>;
    function checkIn(server: Stalk.ServerImplemented, message: IDictionary): Promise<{}>;
    function checkOut(server: Stalk.ServerImplemented): void;
}
declare module "stalkjs" {
    export default stalkjs;
}
