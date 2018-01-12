import { CallingEvents } from "../index";

export interface ICallPayload {
    event: string;
    members: string[];
    payload: any;
}
export type IListener = (data: ICallPayload) => void;

export class CallingDataListener implements CallingEvents.ICallingListener {

    private onCallListeners: IListener[] = new Array();
    public addOnCallListener(fx: IListener) {
        this.onCallListeners.push(fx);
    }
    public removeOnCallListener(fx: IListener) {
        const id = this.onCallListeners.indexOf(fx);
        this.onCallListeners.splice(id, 1);
    }

    onCall(dataEvent: ICallPayload) {
        this.onCallListeners.forEach((fx) => fx(dataEvent));
    }
}
