import { DataEvent } from "./StalkEvents";

export namespace CallingEvents {
    export const ON_CALL = "ON_CALL";
    export interface ICallingListener {
        onCall: DataEvent;
    }

    export const VideoCall = "VideoCall";
    export const VoiceCall = "VoiceCall";
    export const HangupCall = "HangupCall";
    export const TheLineIsBusy = "TheLineIsBusy";
}