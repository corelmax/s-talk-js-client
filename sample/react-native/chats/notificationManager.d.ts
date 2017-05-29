import { Message } from "./models/ChatDataModels";
export default class NotificationManager {
    private static instance;
    static getInstance(): NotificationManager;
    init(onSuccess: (err, deviceToken) => void): void;
    regisNotifyNewMessageEvent(): void;
    unsubscribeGlobalNotifyMessageEvent(): void;
    notify(messageImp: Message): void;
}
