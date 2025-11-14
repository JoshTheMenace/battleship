
class Game {
  constructor() {
    this.id = Math.random().toString(36).substring(2, 15);
    this.gameStatus = 'waiting';
    this.turn = 0;
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

  checkPlayerWon(playerId) {
    console.log('Checking if player', playerId, 'won');
    let player = this.getPlayer(playerId);
    if(!player) {
      console.log('Player not found');
      return;
    }
    console.log('Player found:', player);
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (player.board[row][col] === '1' || player.board[row][col] === '2' || player.board[row][col] === '3' || player.board[row][col] === '4') {
          console.log('Player has not won');
          return false;
        }
      }
    }
    console.log('Player has won');
    return true;
  }

  attack(playerId, row, col) {
    let targetPlayer = this.getPlayer(playerId);
    if (!targetPlayer) {
      console.log('Player not found');
      return [null, null];
    }

    if(this.gameStatus !== 'playing') {
      console.log('Game not playing');
      return [null, null];
    }
    if(this.turn !== playerId) {
      console.log('Not your turn');
      return [null, null];
    }
    // get other player
    console.table(this.players);
    console.log('Player ID:', playerId);
    let otherPlayer = Array.from(this.players.values()).find(player => player.id !== playerId);
    console.log('Other player:', otherPlayer);
    if(!otherPlayer) {
      console.log('Other player not found');
      return [null, null];
    }
    if(otherPlayer.board[row][col] !== null) {
      otherPlayer.board[row][col] = 'hit';
      this.turn = otherPlayer.id;
      return ['hit', otherPlayer.id];
    } else {
      otherPlayer.board[row][col] = 'miss';
      this.turn = otherPlayer.id;
      return ['miss', otherPlayer.id];
    }
    
  }
}

export { Game };