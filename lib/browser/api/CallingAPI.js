var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * calling experiences between phones, apps and VoIP systems
 */
export class CallingAPI {
    constructor(_server) {
        this.server = _server;
    }
    calling(api_key, event, members, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let _message = {};
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
        });
    }
    theLineIsBusy(contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = {};
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
        });
    }
}
