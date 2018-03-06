import * as EventEmitter from "events";


export interface IPomeloResponse {
    code: number;
    message?: string;
    data?: any;
}

export interface IPomelo extends EventEmitter {
    init: (params: any, callback: (error?: any) => void) => void;
    notify: (route: string, message: any) => void;
    request: (route: string, message: any, callback: (result: IPomeloResponse) => void) => void;
    disconnect: () => Promise<null>;
    setReconnect: (reconnect: boolean) => void;
    setInitCallback: (error?: string) => void;
};

export interface IServer { host: string; port: number; };
export class ServerParam implements IServer {
    host: string = "";
    port: number = 0;
    reconnect: boolean = false;
}