import { ServerImp, IDictionary } from "../ServerImplement";

/**
 * calling experiences between phones, apps and VoIP systems
 */
export class CallingAPI {
    private server: ServerImp;

    constructor(_server: ServerImp) {
        this.server = _server;
    }

    public async calling(api_key: string, event: string, members: string[], payload: any) {
        let _message = {} as IDictionary;
        _message["members"] = members;
        _message["event"] = event;
        _message["x-api-key"] = api_key;
        _message["payload"] = payload;

        return new Promise((resolve, rejected) => {
            try {
                let socket = this.server.getSocket();
                socket.request("connector.entryHandler.calling", _message, (result) => {
                    if (result.code == 200) {
                        resolve(result);
                    }
                    else {
                        rejected(result.message);
                    }
                });
            }
            catch (ex) {
                rejected(ex);
            }
        });
    }

    public async theLineIsBusy(contactId: string) {
        let msg = {} as IDictionary;
        msg["contactId"] = contactId;

        return new Promise((resolve, rejected) => {
            try {
                let socket = this.server.getSocket();
                socket.request("connector.entryHandler.theLineIsBusy", msg, (result) => {
                    if (result.code == 200) {
                        resolve(result);
                    }
                    else {
                        rejected(result.message);
                    }
                });
            }
            catch (ex) {
                rejected(ex);
            }
        });
    }
}