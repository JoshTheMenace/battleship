
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
  attack(playerId, row, col) {
    let targetPlayer = this.getPlayer(playerId);
    if (!targetPlayer) {
      console.log('Player not found');
      return;
    }
    // get other player
    let otherPlayer = Array.from(this.players.values()).find(player => player.id !== playerId);
    console.log('Other player:', otherPlayer);
    if(!otherPlayer) {
      console.log('Other player not found');
      return;
    }
    if(otherPlayer.board[row][col] !== null) {
      otherPlayer.board[row][col] = 'hit';
      return 'hit';
    } else {
      otherPlayer.board[row][col] = 'miss';
      return 'miss';
    }
    
  }
}

export { Game };