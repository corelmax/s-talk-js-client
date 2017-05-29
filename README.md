# stalk-javascript-client
Stalk javascript client-api.

```javascript
$ npm install stalk-js --save
or
$ yarn add stalk-js

```

### Example
```javascript
 /**
 * Copyright 2016-2017 Ahoo Studio.co.th.
 *
 */

import { Stalk, ChatRoomApi, Utils, StalkEvents, StalkFactory } from "stalk-js";

const { ChatRoomApiProvider } = ChatRoomApi;
const { ServerImplemented } = Stalk;

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
```
