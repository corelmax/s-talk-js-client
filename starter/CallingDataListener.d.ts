import { CallingEvents } from "../index";
export interface ICallPayload {
    event: string;
    members: string[];
    payload: any;
}
export declare type IListener = (data: ICallPayload) => void;
export declare class CallingDataListener implements CallingEvents.ICallingListener {
    private onCallListeners;
    addOnCallListener(fx: IListener): void;
    removeOnCallListener(fx: IListener): void;
    onCall(dataEvent: ICallPayload): void;
}
