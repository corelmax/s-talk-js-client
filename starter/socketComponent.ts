class SocketComponent {
    onDisconnect(reason: any) {

    }

    disconnected(reason) {
        if (!!this.onDisconnect) {
            this.onDisconnect(reason);
        }
        else {
            console.warn("onDisconnected delegate is empty.");
        }
    }
}