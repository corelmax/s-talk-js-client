import { ServerImp, IDictionary } from "../ServerImplement";
import { IServer } from "../../utils/PomeloUtils";
export declare class GateAPI {
    private server;
    constructor(_server: ServerImp);
    gateEnter(msg: IDictionary): Promise<IServer>;
}
