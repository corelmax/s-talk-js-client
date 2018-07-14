import { CallingEvents } from "../stalkjs";

export interface ICallPayload {
    event: string;
    members: string[];
    payload: any;
}
export type ICallingListener = (data: ICallPayload) => void;

export class CallingDataListener implements CallingEvents.ICallingListener {
    private static instance: CallingDataListener;
    public static createInstance() {
        if (!CallingDataListener.instance) {
            CallingDataListener.instance = new CallingDataListener();
        }

        return CallingDataListener.instance;
    }
    public static getInstance() {
        return CallingDataListener.instance;
    }

    private onCallListeners: ICallingListener[] = new Array();
    public addOnCallListener(fx: ICallingListener) {
        this.onCallListeners.push(fx);
    }
    public removeOnCallListener(fx: ICallingListener) {
        const id = this.onCallListeners.indexOf(fx);
        this.onCallListeners.splice(id, 1);
    }

    onCall(dataEvent: ICallPayload) {
        this.onCallListeners.forEach((fx) => fx(dataEvent));
    }
}
