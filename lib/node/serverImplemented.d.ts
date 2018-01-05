import { IServerImp } from "../Base/IServerImp";
import { IPomelo } from "../utils/PomeloUtils";
/**
 * @deprecated Use es6 Map instead.
 */
export interface IDictionary {
    [k: string]: any;
}
export declare class ServerImplemented implements IServerImp {
    private static Instance;
    static getInstance(): ServerImplemented;
    static connectionProblemString: string;
    socket: IPomelo;
    getSocket(): IPomelo;
    host: string;
    port: number | string;
    _isConnected: boolean;
    _isLogedin: boolean;
    connect: (params: any, callback: (err: any) => void) => void;
    constructor();
    dispose(): void;
    disConnect(callBack?: Function): void;
    logout(): void;
    init(callback: (err, res) => void): void;
    private connectServer(params, callback);
    logIn(_username: string, _hash: string, deviceToken: string, callback: (err, res) => void): void;
    private authenForFrontendServer(_username, _hash, deviceToken, callback);
    gateEnter(uid: string): Promise<any>;
    connectorEnter(msg: IDictionary): Promise<any>;
    TokenAuthen(tokenBearer: string, checkTokenCallback: (err, res) => void): void;
    private OnTokenAuthenticate(tokenRes, onSuccessCheckToken);
    kickMeAllSession(uid: string): void;
}
