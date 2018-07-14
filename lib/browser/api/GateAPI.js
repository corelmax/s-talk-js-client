import { HttpStatusCode } from '../../utils/index';
var GateAPI = /** @class */ (function () {
    function GateAPI(_server) {
        this.server = _server;
    }
    GateAPI.prototype.gateEnter = function (msg) {
        var self = this;
        var socket = this.server.getSocket();
        var result = new Promise(function (resolve, rejected) {
            if (!!socket && self.server._isConnected === false) {
                // <!-- Quering connector server.
                socket.request("gate.gateHandler.queryEntry", msg, function (result) {
                    console.log("gateEnter", result);
                    if (result.code === HttpStatusCode.success) {
                        self.server.disConnect();
                        var data = { host: self.server.host, port: result.port };
                        resolve(data);
                    }
                    else {
                        rejected(result);
                    }
                });
            }
            else {
                var message = "pomelo socket client is null: connecting status is " + self.server._isConnected;
                console.log("Automatic init pomelo socket...");
                rejected(message);
            }
        });
        return result;
    };
    return GateAPI;
}());
export { GateAPI };
