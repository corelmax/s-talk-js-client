export enum MessageType {
    Text = 0,
    Image = 1,
    Video = 2,
    Voice = 3,
    Location = 4,
    Sticker = 5,
    File = 6
};
/**
 * @Message...
 */
export interface IMessage {
    _id: string;
    rid: string;
    type: string;
    body: string;
    sender: string;
    createTime: Date;
    readers: string[];
    meta: IMessageMeta;
    target: string | Array<string>;
}
export interface IMessageMeta {
    duration?: string;
    thumbnail?: string;
    name?: string;
    mimetype: string;
    size: number;
}