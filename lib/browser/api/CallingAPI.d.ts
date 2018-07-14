import { ServerImp } from "../ServerImplement";
/**
 * calling experiences between phones, apps and VoIP systems
 */
export declare class CallingAPI {
    private server;
    constructor(_server: ServerImp);
    calling(api_key: string, event: string, members: string[], payload: any): Promise<{}>;
    theLineIsBusy(contactId: string): Promise<{}>;
}
