import { DataEvent } from "./StalkEvents";
export declare namespace PushEvents {
    const ON_PUSH = "ON_PUSH";
    interface IPushServerListener {
        onPush: DataEvent;
    }
}
