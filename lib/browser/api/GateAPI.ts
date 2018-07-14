import { ServerImp, IDictionary } from "../ServerImplement";

import { HttpStatusCode, IPomeloResponse } from '../../utils/index';
import { IServer } from "../../utils/PomeloUtils";

export class GateAPI {
    private server: ServerImp;
    constructor(_server: ServerImp) {
        this.server = _server;
    }

    gateEnter(msg: IDictionary) {
        const self = this;
        const socket = this.server.getSocket();

        const result = new Promise((resolve: (data: IServer) => void, rejected) => {
            if (!!socket && self.server._isConnected === false) {
                // <!-- Quering connector server.
                socket.request("gate.gateHandler.queryEntry", msg, (result: any) => {
                    console.log("gateEnter", result);

                    if (result.code === HttpStatusCode.success) {
                        self.server.disConnect();

                        const data = { host: self.server.host, port: result.port };
                        resolve(data);
                    }
                    else {
                        rejected(result);
                    }
                });
            }
            else {
                const message = "pomelo socket client is null: connecting status is " + self.server._isConnected;
                console.log("Automatic init pomelo socket...");

                rejected(message);
            }
        });

        return result;
    }
}