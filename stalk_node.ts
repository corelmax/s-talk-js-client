/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th 
 */

import { ServerImplement, IDictionary } from "./lib/node/ServerImplement";

const stalk = ServerImplement.getInstance();
export type Dict = IDictionary;
export type Stalk = ServerImplement;

function initStalk(): Promise<ServerImplement> {
    return new Promise((resolve, reject) => {
        stalk.init((err, result) => {
            if (err) {
                console.error("init stalk fail: ", err.message);
                stalk._isConnected = false;
                reject(err.message);
                return;
            }

            console.log("Stalk init success.");
            stalk._isConnected = true;

            stalk.socket.on("disconnect", function data(reason: any) {
                stalk._isConnected = false;
            });

            resolve(stalk);
        });
    });
}

function pushMessage(msg: IDictionary): Promise<ServerImplement> {
    return new Promise((resolve, reject) => {
        if (stalk._isConnected) {
            stalk.getSocket().request("push.pushHandler.push", msg, (result: any) => {
                console.log("request result", result);
            });

            resolve(stalk);
        }
        else {
            reject(stalk);
        }
    });
}

export async function init() {
    initStalk().then(stalk => {
        if (!stalk._isConnected) {
            return false;
        }

        return true;
    }).catch(err => {
        return false;
    });
}

/**
 * For test call api omly...
 */
export function testCall() {
    let msg: IDictionary = {};
    msg["event"] = "Test api.";
    msg["message"] = "test api from express.js client.";
    msg["timestamp"] = new Date();
    msg["members"] = "*";

    pushMessage(msg).catch((stalk: ServerImplement) => {
        init().then(boo => {
            if (boo) {
                testCall();
            }
        });
    });
}

export function push(msg: IDictionary) {
    pushMessage(msg).catch((stalk: ServerImplement) => {
        init().then(boo => {
            if (boo) {
                push(msg);
            }
        });
    });
}