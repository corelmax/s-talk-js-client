import { CallingEvents } from "../index";
export interface ICallPayload {
    event: string;
    members: string[];
    payload: any;
}
export declare type ICallingListener = (data: ICallPayload) => void;
export declare class CallingDataListener implements CallingEvents.ICallingListener {
    private static instance;
    static createInstance(): CallingDataListener;
    static getInstance(): CallingDataListener;
    private onCallListeners;
    addOnCallListener(fx: ICallingListener): void;
    removeOnCallListener(fx: ICallingListener): void;
    onCall(dataEvent: ICallPayload): void;
}
