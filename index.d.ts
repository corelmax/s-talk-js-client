/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th
 */
export * from "./lib/browser/serverImplemented";
export * from "./lib/browser/StalkEvents";
export * from "./lib/browser/API";
import { StalkJS } from "./lib/browser/StalkJS";
declare module "stalk-js" {
    export = StalkJS;
}
