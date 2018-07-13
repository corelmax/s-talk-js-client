import { DataEvent } from "./StalkEvents";
export declare namespace ChatEvents {
    const ON_ADD = "onAdd";
    const ON_LEAVE: string;
    const ON_CHAT: string;
    interface IChatServerEvents {
        onChat: DataEvent;
        onRoomJoin: DataEvent;
        onLeaveRoom: DataEvent;
    }
}
