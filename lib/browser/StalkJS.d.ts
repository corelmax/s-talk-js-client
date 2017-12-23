import { HttpStatusCode } from "../utils/httpStatusCode";
import { Authen } from "../utils/tokenDecode";
import { Stalk, IDictionary } from "./serverImplemented";
export declare namespace StalkJS {
    module Utils {
        var statusCode: typeof HttpStatusCode;
        var tokenDecode: typeof Authen.TokenDecoded;
    }
    function create(_host: string, _port: number): Stalk.ServerImplemented;
    function init(server: Stalk.ServerImplemented): Promise<any>;
    function geteEnter(server: Stalk.ServerImplemented, message: IDictionary): Promise<any>;
    function handshake(server: Stalk.ServerImplemented, params: Stalk.ServerParam): Promise<any>;
    function checkIn(server: Stalk.ServerImplemented, message: IDictionary): Promise<{}>;
    function checkOut(server: Stalk.ServerImplemented): void;
}
