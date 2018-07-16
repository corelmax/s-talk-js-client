import { DataEvent } from "./StalkEvents";

export namespace ChatEvents {
    export const ON_ADD = "onAdd";
    export const ON_LEAVE: string = "onLeave";

    export const ON_CHAT: string = "ON_CHAT";
    export interface IChatServerEvents {
        onChat: DataEvent;
        onRoomJoin: DataEvent;
        onLeaveRoom: DataEvent;
    }
}
