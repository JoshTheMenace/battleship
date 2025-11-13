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
            console.log('Event type:', event.type);
            console.log('Event data:', event.data);
            const data = JSON.parse(event.data);
            if (data.type === 'game') {
                this.game = data.data;
                console.log('Game:', this.game);
            } else if (data.type === 'player') {
                this.player = data.data;
                console.log('Player:', this.player);
            } else if (data.type === 'placePieceResponse') {
                console.log('Place piece response:', data.success, 'by player', data.playerId, 'at', data.row, data.col);
                if (data.success) {
                    console.log('Place piece successful');
                } else {
                    console.log('Place piece failed');
                }
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


