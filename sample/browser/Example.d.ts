/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
import { Stalk, ChatRoomApi } from "stalk-js";
/**
 * Preparing connection...
 */
export declare class Example {
    stalk: Stalk.ServerImplemented;
    chatRoomApiProvider: ChatRoomApi.ChatRoomApiProvider;
    constructor(host: any, port: any);
    stalkInit(): Promise<any>;
    handshake(uid: string): Promise<any>;
    checkIn(user: any): Promise<any>;
}
/**
 *
 * login to stalk.
 */
export declare function stalkLogin(user: any): void;
