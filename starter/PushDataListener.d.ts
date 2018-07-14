import { PushEvents } from "../stalkjs";
export declare type Push = {
    event: string;
    message: any;
    timestamp: Date;
    members: Array<string>;
};
export declare type IListener = (data: Push) => void;
export declare class PushDataListener implements PushEvents.IPushServerListener {
    private onPushEvents;
    addPushEvents(fx: IListener): void;
    removePushEvents(fx: IListener): void;
    onPush(dataEvent: Push): void;
}
