export interface IDictionary {
    [k: string]: any;
}
export interface IAuthenData {
    userId: string;
    token: string;
}
export interface IPomeloParam {
    host: string;
    port: number;
    reconnect: boolean;
}
export interface PomeloClient {
    init(params: any, cb: any): any;
    notify(route: string, msg: IDictionary): any;
    request(route: string, msg: IDictionary, cb: any): any;
    on(event: string, data: any): any;
    setReconnect(_reconnect: boolean): any;
    disconnect(): any;
    removeAllListeners(): any;
}
export default class ServerImplemented {
    private static Instance;
    static getInstance(): ServerImplemented;
    static connectionProblemString: string;
    pomelo: PomeloClient;
    host: string;
    port: number | string;
    authenData: IAuthenData;
    _isConnected: boolean;
    _isLogedin: boolean;
    connect: (params: IPomeloParam, callback: (err: any) => void) => void;
    constructor();
    getClient(): PomeloClient | undefined;
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
