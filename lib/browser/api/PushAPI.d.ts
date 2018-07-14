import { ServerImp, IDictionary } from "../ServerImplement";
export declare class PushAPI {
    private server;
    constructor(_server: ServerImp);
    /**
     * payload: {
     *  event: string;
     *  message: string;
     *  members: string[] | string;
     * }
     *
     * @param {IDictionary} _message
     * @returns
     * @memberof PushAPI
     */
    push(_message: IDictionary): Promise<{}>;
}
