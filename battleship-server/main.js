import { WebSocketServer, WebSocket } from 'ws';
import { Player } from './Player.js';
import { Game } from './game.js';
const wss = new WebSocketServer({ port: 8080 });

const clients = new Map();

// Helper function to broadcast to all connected clients
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}





let game = new Game();







wss.on('connection', function connection(ws) {
  const player = new Player('Player ' + clients.size + 1);
  game.addPlayer(player);
  console.log('Player added:', player);
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

      
      
      ws.send(JSON.stringify({ type: 'placePieceResponse', success: targetPlayer.placePiece(data.piece, data.row, data.col), playerId: data.playerId, piece: data.piece, board: targetPlayer.board }));
      console.log('piece placed:', data.piece, 'by player', data.playerId, 'at', data.row, data.col);
    
    } else if (data.type === 'ready') {
      let targetPlayer = game.getPlayer(data.playerId);
      if (!targetPlayer) {
        console.log('Player not found');
        return;
      }
      targetPlayer.setReady(true);
      console.log('Player', data.playerId, 'is ready');

      if (Array.from(game.players.values()).every(player => player.ready)) {
        game.gameStatus = 'playing';
        const playersArray = Array.from(game.players.values());
        const randomIndex = Math.floor(Math.random() * 2);
        game.turn = playersArray[randomIndex].id;
        console.log('Game started, turn:', game.turn);
        broadcast(JSON.stringify({ type: 'turn', turn: game.turn }));
      }

    } else if (data.type === 'attack') {
      let targetPlayer = game.getPlayer(data.playerId);
      if (!targetPlayer) {
        console.log('Player not found');
        return;
      }
      let [result, opponentId] = game.attack(data.playerId, data.row, data.col);
      if (result !== null) {
        broadcast(JSON.stringify({ type: 'attackResponse', result: result, playerId: opponentId, row: data.row, col: data.col }));
        console.log('Player', data.playerId, 'attacked cell', data.row, data.col);
        broadcast(JSON.stringify({ type: 'turn', turn: game.turn }));
      }
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