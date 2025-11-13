// a websocket client that can be used to connect to the battleship server

export class WebsocketClient {
    constructor(url, callbacks = {}) {
        this.game = null;
        this.player = null;
        this.board = null;
        this.callbacks = callbacks;
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
                this.board = data.board;
                console.log('Board:', this.board);
                // Trigger the callback to update the board in the UI
                if (this.callbacks.onBoardUpdate) {
                    this.callbacks.onBoardUpdate(this.board);
                }
            } else if (data.type === 'attackResponse') {
                console.log('Attack response:', data.result, 'by player', data.playerId, 'at', data.row, data.col);
                if (this.callbacks.onAttackResponse) {
                    this.callbacks.onAttackResponse(data.result, data.row, data.col, data.playerId);
                }
            } else if (data.type === 'turn') {
                console.log('Turn:', data.turn);
                if (this.callbacks.onTurnUpdate) {
                    this.callbacks.onTurnUpdate(data.turn);
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


