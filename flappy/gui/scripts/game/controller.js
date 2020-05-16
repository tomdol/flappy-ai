class Controller extends EventTarget {
    constructor(ws_addr) {
        super();

        this.ws = null;
        this.ws_addr = ws_addr;
    }

    connect() {
        this.ws = new WebSocket(this.ws_addr);
        this.ws.addEventListener("open", this.handleWsOpen.bind(this));
        this.ws.addEventListener("close", this.handleWsClose.bind(this));
        this.ws.addEventListener("error", this.handleWsError.bind(this));
        this.ws.addEventListener("message", this.handleWsMessage.bind(this));
    }

    handleWsOpen(evt) {
        this.dispatchEvent(new Event('connected'));
    }

    handleWsError(evt) {
        this.dispatchEvent(new CustomEvent('websocket_error', evt));
    }

    handleWsClose(evt) {
        this.dispatchEvent(new CustomEvent('disconnected', evt));
    }

    handleWsMessage(evt) {
        const message = JSON.parse(evt.data);

        this.dispatchEvent(new CustomEvent(message.command, message.params));
    }
}
