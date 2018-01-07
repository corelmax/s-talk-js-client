/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */

import * as async from "async";
import * as Rx from "rxjs/Rx";

import { BackendFactory } from "../../starter/BackendFactory";
import { DataListener } from "../../starter/DataListener";
import { ChatEvents } from "../../index";
import * as chatroomService from "./services/ChatroomService";

import { decryptionText, hashComputation } from "./utils/CryptoHelper";
import { ISecureService, SecureServiceFactory } from "./index";

import { MessageType, IMessage, RoomAccessData } from "../../starter/models";
import {
    MessageImp,
    Room, IMember
} from "./models/index";

// import { imagesPath } from "../consts/StickerPath";
import InternalStore from "./InternalStore";
const getConfig = () => BackendFactory.getInstance().config;
// const getStore = () => ChitChatFactory.getInstance().store;

export const ON_MESSAGE_CHANGE = "ON_MESSAGE_CHANGE";

export class ChatRoomComponent implements ChatEvents.IChatServerEvents {
    private static instance: ChatRoomComponent;
    public static getInstance() {
        return ChatRoomComponent.instance;
    }
    public static createInstance(datamanager: any) {
        if (!ChatRoomComponent.instance) {
            ChatRoomComponent.instance = new ChatRoomComponent(datamanager);
        }

        return ChatRoomComponent.instance;
    }

    public chatroomDelegate: (eventName: string, data: MessageImp | Array<MessageImp>) => void;
    public outsideRoomDelegete: (eventName: string, data: any) => void;
    private roomId: string;
    public getRoomId(): string {
        return this.roomId;
    }
    public setRoomId(rid: string): void {
        this.roomId = rid;
    }
    private secure: ISecureService;
    private dataManager: any;
    private dataListener: DataListener;

    private updateMessageQueue = new Array<MessageImp>();

    constructor(dataManager: any) {
        console.log("ChatRoomComponent: constructor");

        this.secure = SecureServiceFactory.getService();
        let backendFactory = BackendFactory.getInstance();

        this.dataManager = dataManager;
        this.dataListener = backendFactory.dataListener;
        this.dataListener.addOnChatListener(this.onChat.bind(this));

        const source = Rx.Observable.timer(1000, 1000);
        const subscribe = source.subscribe(val => {
            if (this.updateMessageQueue.length > 0) {
                let queues = this.updateMessageQueue.slice();
                this.updateMessageQueue = new Array();
                this.messageReadTick(queues, this.roomId);
            }
        });
    }

    saveMessages = (chatMessages: Array<MessageImp>, message: MessageImp) => {
        let self = this;
        chatMessages.push(message);

        self.dataManager.messageDAL.saveData(self.roomId, chatMessages)
            .then(chats => {
                if (!!self.chatroomDelegate) {
                    self.chatroomDelegate(ChatEvents.ON_CHAT, message);
                    self.chatroomDelegate(ON_MESSAGE_CHANGE, chatMessages);
                }
            });
    };

    saveToPersisted(message: MessageImp) {
        let self = this;
        this.dataManager.messageDAL.getData(this.roomId)
            .then((chats: Array<IMessage>) => {
                let chatMessages = (!!chats && Array.isArray(chats)) ? chats : new Array();

                if (message.type === MessageType[MessageType.Text]) {
                    decryptionText(message)
                        .then(decoded => {
                            self.saveMessages(chatMessages, message);
                        })
                        .catch(err => self.saveMessages(chatMessages, message));
                }
                // else if (message.type === MessageType[MessageType.Sticker]) {
                //     let sticker_id = parseInt(message.body);
                //     message.src = imagesPath[sticker_id].img;
                //     saveMessages(chatMessages);
                // }
                else {
                    self.saveMessages(chatMessages, message);
                }
            }).catch(err => {
                console.warn("Cannot get persistend message of room", err);
            });
    }

    onChat(message: MessageImp) {
        console.log("ChatRoomComponent.onChat", message);

        if (this.roomId === message.rid) {
            this.saveToPersisted(message);
        }
        else {
            console.log("this msg come from other room.");

            if (!!this.outsideRoomDelegete) {
                this.outsideRoomDelegete(ChatEvents.ON_CHAT, message);
            }
        }
    }

    onRoomJoin(data) { }

    onLeaveRoom(data) { }

    private async messageReadTick(messageQueue: Array<MessageImp>, room_id: string) {
        let chatMessages = Object.create(null) as Array<any>;
        let chats = await this.dataManager.messageDAL.getData(room_id);
        chatMessages = (!!chats && Array.isArray(chats)) ? chats : new Array<MessageImp>();

        messageQueue.forEach(message => {
            chatMessages.some((value) => {
                if (value._id === message._id) {
                    value.readers = message.readers;

                    return true;
                }
            });
        });

        let results = await this.dataManager.messageDAL.saveData(room_id, chatMessages);
        if (!!this.chatroomDelegate) {
            this.chatroomDelegate(ON_MESSAGE_CHANGE, results);
        }
    }

    onMessageRead(message: IMessage) {
        this.updateMessageQueue.push(message as MessageImp);
    }

    onGetMessagesReaders(dataEvent) {
        console.log("onGetMessagesReaders", dataEvent);

        let self = this;
        interface Ireaders {
            _id: string;
            readers: Array<string>;
        }
        let myMessagesArr: Array<Ireaders> = JSON.parse(JSON.stringify(dataEvent.data));

        self.chatMessages.forEach((originalMsg, id, arr) => {
            if (self.dataManager.isMySelf(originalMsg.sender)) {
                myMessagesArr.some((myMsg, index, array) => {
                    if (originalMsg._id === myMsg._id) {
                        originalMsg.readers = myMsg.readers;
                        return true;
                    }
                });
            }
        });

        self.dataManager.messageDAL.saveData(self.roomId, self.chatMessages);
    }

    public async getPersistentMessage(rid: string) {
        let self = this;
        let messages = await self.dataManager.messageDAL.getData(rid);

        if (messages && messages.length > 0) {
            let prom = new Promise((resolve: (data: Array<IMessage>) => void, reject) => {
                let chats = messages.slice(0) as Array<IMessage>;
                async.forEach(chats, function iterator(chat, result) {
                    if (chat.type === MessageType[MessageType.Text]) {
                        if (getConfig().appConfig.encryption === true) {
                            self.secure.decryption(chat.body).then(function (res) {
                                chat.body = res;

                                result(null);
                            }).catch(err => result(null));
                        }
                        else {
                            result(null);
                        }
                    }
                    else {
                        result(null);
                    }
                }, (err) => {
                    console.log("decoded chats completed.", chats.length);

                    self.dataManager.messageDAL.saveData(rid, chats);
                    resolve(chats);
                });
            });

            let chats = await prom;
            return chats;
        }
        else {
            console.log("chatMessages is empty!");
            return new Array<IMessage>();
        }
    }

    public async getNewerMessageRecord(callback: (results: Array<IMessage>, room_id: string) => void) {
        let self = this;
        let lastMessageTime = new Date();

        const getLastMessageTime = (cb: (boo: boolean) => void) => {
            let { roomAccess }: { roomAccess: Array<RoomAccessData> } = getStore().getState().chatlogReducer;
            async.some(roomAccess, (item, cb) => {
                if (item.roomId === self.roomId) {
                    lastMessageTime = item.accessTime;
                    cb(null, true);
                }
                else {
                    cb(null, false);
                }
            }, (err, result) => {
                cb(result);
            });
        };

        const saveMergedMessage = async (histories: Array<IMessage>) => {
            let _results = new Array();
            if (messages && messages.length > 0) {
                _results = messages.concat(histories);
            }
            else {
                _results = histories.slice();
            }
            // Save persistent chats log here.
            let results = await self.dataManager.messageDAL.saveData(self.roomId, _results) as Array<IMessage>;

            callback(_results, this.roomId);
        };

        const getNewerMessage = async () => {
            try {
                let histories = await self.getNewerMessages(lastMessageTime) as Array<IMessage>;
                saveMergedMessage(histories);
            }
            catch (ex) {
                saveMergedMessage([]);
            }
        };

        let messages: IMessage[] = await self.dataManager.messageDAL.getData(this.roomId);
        if (messages && messages.length > 0) {
            if (messages[messages.length - 1] !== null) {
                lastMessageTime = messages[messages.length - 1].createTime;
                getNewerMessage();
            }
            else {
                getLastMessageTime((boo) => {
                    getNewerMessage();
                });
            }
        } else {
            getLastMessageTime((boo) => {
                getNewerMessage();
            });
        }
    }

    private async getNewerMessages(lastMessageTime: Date) {
        let self = this;

        try {
            let response = await chatroomService.getNewerMessages(self.roomId, lastMessageTime);
            let value = await response.json();
            console.log("getNewerMessages result", value);

            return new Promise((resolve, reject) => {
                if (value.success) {
                    let histories = new Array<IMessage>();
                    histories = value.result;
                    if (histories.length > 0) {
                        async.forEach(histories, function (chat, cb) {
                            if (chat.type === MessageType[MessageType.Text]) {
                                if (getConfig().appConfig.encryption === true) {
                                    self.secure.decryption(chat.body).then(function (res) {
                                        chat.body = res;
                                        cb(null);
                                    }).catch(err => {
                                        cb(null);
                                    });
                                }
                                else {
                                    cb(null);
                                }
                            }
                            else {
                                cb(null);
                            }
                        }, function done(err) {
                            if (!!err) {
                                console.error("get newer message error", err);
                                reject(err);
                            }
                            else {
                                resolve(histories);
                            }
                        });
                    }
                    else {
                        console.log("Have no newer message.");
                        resolve(histories);
                    }
                }
                else {
                    console.warn("WTF god only know.", value.message);
                    reject(value.message);
                }
            });
        }
        catch (err) {
            throw new Error(err.message);
        }
    }

    public async getOlderMessageChunk(room_id: string) {
        let self = this;

        async function waitForRoomMessages() {
            let messages = await self.dataManager.messageDAL.getData(room_id) as IMessage[];

            return messages;
        }

        async function saveRoomMessages(merged: Array<IMessage>) {
            let value = await self.dataManager.messageDAL.saveData(room_id, merged);

            return value as Array<IMessage>;
        }

        let time = await self.getTopEdgeMessageTime() as Date;
        if (time) {
            let response = await chatroomService.getOlderMessagesCount(room_id, time.toString(), true);
            let result = await response.json();

            console.log("getOlderMessageChunk value", result);
            // todo
            /**
             * Merge messages record to chatMessages array.
             * Never save message to persistend layer.
             */
            if (result.success && result.result.length > 0) {
                let earlyMessages = result.result as Array<IMessage>;
                let persistMessages = await waitForRoomMessages();

                if (!!persistMessages && persistMessages.length > 0) {
                    let mergedMessageArray = new Array<IMessage>();
                    mergedMessageArray = earlyMessages.concat(persistMessages);

                    let resultsArray = new Array<IMessage>();
                    let results = await new Promise((resolve: (data: Array<IMessage>) => void, rejected) => {
                        async.map(mergedMessageArray, function iterator(item, cb) {
                            let hasMessage = resultsArray.some((value, id) => {
                                if (!!value && value._id === item._id) {
                                    return true;
                                }
                            });

                            if (hasMessage === false) {
                                resultsArray.push(item);
                                cb(null, null);
                            }
                            else {
                                cb(null, null);
                            }
                        }, function done(err, results) {
                            let merged = resultsArray.sort(self.compareMessage);

                            resolve(merged);
                        });
                    });

                    return await saveRoomMessages(results);
                }
                else {
                    let merged = earlyMessages.sort(self.compareMessage);
                    return await saveRoomMessages(merged);
                }
            }
            else {
                return new Array();
            }
        }
        else {
            throw new Error("getTopEdgeMessageTime fail");
        }
    }

    public async getTopEdgeMessageTime() {
        let self = this;

        async function waitRoomMessage() {
            let topEdgeMessageTime = new Date();
            let messages = await self.dataManager.messageDAL.getData(self.roomId) as IMessage[];

            if (!!messages && messages.length > 0) {
                if (!!messages[0].createTime) {
                    topEdgeMessageTime = messages[0].createTime;
                }
            }
            console.log("topEdgeMessageTime is: ", topEdgeMessageTime);

            return topEdgeMessageTime;
        }

        return new Promise((resolve: (data: Date) => void, reject) => {
            waitRoomMessage().then((topEdgeMessageTime) => {
                resolve(topEdgeMessageTime);
            }).catch(err => {
                reject(err);
            });
        });
    }

    private compareMessage(a: IMessage, b: IMessage) {
        if (a.createTime > b.createTime) {
            return 1;
        }
        if (a.createTime < b.createTime) {
            return -1;
        }
        // a must be equal to b
        return 0;
    }

    public updateReadMessages() {
        let self = this;
        let backendFactory = BackendFactory.getInstance();
        async.map(self.chatMessages, function itorator(message, resultCb) {
            if (!backendFactory.dataManager.isMySelf(message.sender)) {
                let chatroomApi = backendFactory.getServer().getChatRoomAPI();
                chatroomApi.updateMessageReader(message._id, message.rid);
            }

            resultCb(null, null);
        }, function done(err) {
            // done.
        });
    }

    public async updateWhoReadMyMessages() {
        let self = this;

        let res = await self.getTopEdgeMessageTime();
        let backendFactory = BackendFactory.getInstance();
        let chatroomApi = backendFactory.getServer().getChatRoomAPI();
        chatroomApi.getMessagesReaders(res.toString());
    }

    public getMemberProfile(member: IMember, callback: (err, res) => void) {
        let server = BackendFactory.getInstance().getServer();

        if (server) {
            server.getMemberProfile(member._id, callback);
        }
    }

    public async getMessages() {
        let messages = await this.dataManager.messageDAL.getData(this.roomId);
        return messages;
    }

    public dispose() {
        console.log("ChatRoomComponent: dispose");
        this.dataListener.removeOnChatListener(this.onChat.bind(this));
        delete ChatRoomComponent.instance;
    }
}