export interface IServerParam {
    host: string;
    port: number;
    reconnect: boolean;
    maxReconnectAttempts?: number;
    handshakeCallback?: any;
    encode?: any;
    decode?: any;
    user?: any;
    encrypt?: any;
}
