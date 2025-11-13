import { WebSocketServer } from 'ws';
import { Player } from './Player.js';
const wss = new WebSocketServer({ port: 8080 });

const clients = new Map();


class Game {
  constructor() {
    this.id = Math.random().toString(36).substring(2, 15);
    this.gameStatus = 'waiting for players';
    this.players = new Map();
  }
  addPlayer(player) {
    this.players.set(player.id, player);
  }
  removePlayer(player) {
    this.players.delete(player.id);
  }
  getPlayer(id) {
    return this.players.get(id);
  }
}


let game = new Game();







wss.on('connection', function connection(ws) {
  const player = new Player('Player ' + clients.size + 1);
  game.addPlayer(player);
  clients.set(ws, player.id);

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Message received:', data);
    if (data.type === 'placePiece') {
      let targetPlayer = game.getPlayer(data.playerId);
      if (!targetPlayer) {
        console.log('Player not found');
        return;
      }

      
      
      ws.send(JSON.stringify({ type: 'placePieceResponse', success: targetPlayer.placePiece(data.piece, data.row, data.col), playerId: data.playerId, piece: data.piece, row: data.row, col: data.col }));
      console.log('piece placed:', data.piece, 'by player', data.playerId, 'at', data.row, data.col);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    game.removePlayer(player);
    clients.delete(ws);
  });

  ws.send('Welcome to the WebSocket server!');
  ws.send(JSON.stringify({ type: 'game', data: game }));
  ws.send(JSON.stringify({ type: 'player', data: player }));
});

console.log('WebSocket server started on port 8080');