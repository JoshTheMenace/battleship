// a websocket client that can be used to connect to the battleship server

export class WebsocketClient {
    constructor(url) {
        this.game = null;
        this.player = null;
        if (typeof url !== 'string') {
            throw new Error('URL must be a string');
        }
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            console.log('Connected to the server');
        };
        this.socket.onmessage = (event) => {
            console.log('Received message from the server: %s', event.data);

            if (event.data.type === 'game') {
                this.game = JSON.parse(event.data);
                console.log('Game:', this.game);
            } else if (event.data.type === 'player') {
                this.player = JSON.parse(event.data);
                console.log('Player:', this.player);
            }
        };
        this.socket.onerror = (error) => {
            console.error('Error:', error);
        };
    }

    sendMessage(message) {
        this.socket.send(message);
    }

    close() {
        this.socket.close();
    }
}


