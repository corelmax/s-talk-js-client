import { ServerImp, IDictionary } from "./ServerImplement";
import { HttpStatusCode } from "../utils/httpStatusCode";
import { Authen } from "../utils/tokenDecode";
import { IPomelo, ServerParam, IServer } from "../utils/PomeloUtils";
export declare namespace StalkJS {
    module Utils {
        var statusCode: typeof HttpStatusCode;
        var tokenDecode: typeof Authen.TokenDecoded;
    }
    function create(_host: string, _port: number): ServerImp;
    function init(server: ServerImp): Promise<IPomelo>;
    function geteEnter(server: ServerImp, message: IDictionary): Promise<IServer>;
    function handshake(server: ServerImp, params: ServerParam): Promise<IPomelo>;
    function checkIn(server: ServerImp, message: IDictionary): Promise<{}>;
    function checkOut(server: ServerImp): void;
}
