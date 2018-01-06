import { PushEvents } from "../index";


export type Push = {
    event: string;
    message: any;
    timestamp: Date;
    members: Array<string>;
};
export type IListener = (data: Push) => void;

export class PushDataListener implements PushEvents.IPushServerListener {

    private onPushEvents: Array<IListener> = new Array();
    public addPushEvents(fx: IListener) {
        this.onPushEvents.push(fx);
    }
    public removePushEvents(fx: IListener) {
        let id = this.onPushEvents.indexOf(fx);
        this.onPushEvents.splice(id, 1);
    }

    onPush(dataEvent: Push) {
        this.onPushEvents.forEach(fx => fx(dataEvent));
    }
}