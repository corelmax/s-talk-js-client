import { absSpartan } from "../libs/stalk/spartanEvents";
export default class PushDataListener implements absSpartan.IPushServerListener {
    private onPushEvents;
    addPushEvents(fx: (dataEvent) => void): void;
    removePushEvents(fx: (dataEvent) => void): void;
    onPush(dataEvent: any): void;
}
