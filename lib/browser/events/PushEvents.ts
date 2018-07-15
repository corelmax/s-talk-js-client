import { DataEvent } from "./StalkEvents";

export namespace PushEvents {
    export const ON_PUSH = "ON_PUSH";
    export interface IPushServerListener {
        onPush: DataEvent;
    }
}