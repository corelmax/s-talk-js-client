import { Stalk } from "./ServerImplement";
import { HttpStatusCode } from "../utils/httpStatusCode";
import { Authen } from "../utils/tokenDecode";
import { IPomelo, ServerParam, IServer } from "../utils/PomeloUtils";
export declare namespace StalkJS {
    module Utils {
        var statusCode: typeof HttpStatusCode;
        var tokenDecode: typeof Authen.TokenDecoded;
    }
    function create(_host: string, _port: number): Stalk.ServerImplemented;
    function init(server: Stalk.ServerImplemented): Promise<IPomelo>;
    function geteEnter(server: Stalk.ServerImplemented, message: Stalk.IDictionary): Promise<IServer>;
    function handshake(server: Stalk.ServerImplemented, params: ServerParam): Promise<IPomelo>;
    function checkIn(server: Stalk.ServerImplemented, message: Stalk.IDictionary): Promise<{}>;
    function checkOut(server: Stalk.ServerImplemented): void;
}
