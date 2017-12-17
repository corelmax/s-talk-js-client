export namespace SocketComponent {
    export class SocketComponent {
        onDisconnect: (reason: any) => void;
        disconnected(reason: any) {
            if (!!this.onDisconnect) {
                this.onDisconnect(reason);
            }
            else {
                console.warn("onDisconnected delegate is empty.");
            }
        }
    }
}