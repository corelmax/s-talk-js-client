/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */

import { Stalk, ChatRoomApi, Utils, StalkEvents, StalkFactory } from "stalk-js";

const { ChatRoomApiProvider } = ChatRoomApi;
const { ServerImplemented } = Stalk;

/**
 * Preparing connection... 
 */
export class Example {
    stalk: Stalk.ServerImplemented;
    chatRoomApiProvider: ChatRoomApi.ChatRoomApiProvider;

    constructor(host, port) {
        this.stalk = StalkFactory.create(host, port);
    }

    async stalkInit() {
        let socket = await StalkFactory.init(this.stalk);
        return socket;
    }

    async handshake(uid: string) {
        try {
            // @ get connector server.
            let msg = {} as Utils.dataDict;
            msg["uid"] = uid;
            msg["x-api-key"] = /* your api key*/;
            let connector = await StalkFactory.geteEnter(this.stalk, msg);

            let params = { host: connector.host, port: connector.port, reconnect: false } as Stalk.ServerParam;
            await StalkFactory.handshake(this.stalk, params);

            return await connector;
        } catch (ex) {
            throw new Error("handshake fail: " + ex.message);
        }
    }

    async checkIn(user: any) {
        let msg = {} as Utils.dataDict;
        msg["user"] = user;
        msg["x-api-key"] = /* your api key*/;
        let result = await StalkFactory.checkIn(this.stalk, msg);
        return result;
    }
}

/**
 * 
 * login to stalk.
 */
export function stalkLogin(user: any) {
    const exam = new Example("stalk.com", 3010);

    exam.stalkInit().then(socket => {
        exam.handshake(user._id).then((connector) => {
            exam.checkIn(user).then((value) => {
                console.log("Joined stalk-service success", value);
                let result: { success: boolean, token: any } = JSON.parse(JSON.stringify(value.data));
                if (result.success) {
                    // Save token for your session..
                }
                else {
                    console.warn("Joined chat-server fail: ", result);
                }
            }).catch(err => {
                console.warn("Cannot checkIn", err);
            });
        }).catch(err => {
            console.warn("Hanshake fail: ", err);
        });
    }).catch(err => {
        console.log("StalkInit Fail.", err);
    });
}