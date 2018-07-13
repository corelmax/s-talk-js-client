var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class PushAPI {
    constructor(_server) {
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
    push(_message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                try {
                    let socket = this.server.getSocket();
                    socket.request("push.pushHandler.push", _message, (result) => {
                        resolve(result);
                    });
                }
                catch (ex) {
                    reject(ex.message);
                }
            });
        });
    }
}
