import { ServerImp, IDictionary } from "../ServerImplement";

import { IPomeloResponse } from '../../utils/index';

export class PushAPI {
    private server: ServerImp;

    constructor(_server: ServerImp) {
        this.server = _server;
    }

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
    public async push(_message: IDictionary) {
        return await new Promise((resolve, reject) => {
            try {
                let socket = this.server.getSocket();
                socket.request("push.pushHandler.push", _message, (result: IPomeloResponse) => {
                    resolve(result);
                });
            }
            catch (ex) {
                reject(ex.message);
            }
        });
    }
}
