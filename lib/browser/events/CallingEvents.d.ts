import { DataEvent } from "./StalkEvents";
export declare namespace CallingEvents {
    const ON_CALL = "ON_CALL";
    interface ICallingListener {
        onCall: DataEvent;
    }
    const VideoCall = "VideoCall";
    const VoiceCall = "VoiceCall";
    const HangupCall = "HangupCall";
    const TheLineIsBusy = "TheLineIsBusy";
}
