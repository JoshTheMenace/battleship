import { WebSocketServer } from 'ws';
import { Player } from './Player.js';
import { Game } from './game.js';
const wss = new WebSocketServer({ port: 8080 });

const clients = new Map();



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
        console.log('Game started');
      }

    } else if (data.type === 'attack') {
      let targetPlayer = game.getPlayer(data.playerId);
      if (!targetPlayer) {
        console.log('Player not found');
        return;
      }
      let result = game.attack(data.playerId, data.row, data.col);
      ws.send(JSON.stringify({ type: 'attackResponse', result: result, playerId: data.playerId, row: data.row, col: data.col }));
      console.log('Player', data.playerId, 'attacked cell', data.row, data.col);
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