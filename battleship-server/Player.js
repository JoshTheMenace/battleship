
class Player {
  constructor(name) {
    this.name = name;
    this.id = Math.random().toString(36).substring(2, 15);
    this.board = new Array(10).fill(null).map(() => new Array(10).fill(null));
    this.ready = false;
  }

  checkPlacement(piece, row, col) {
    if (piece.orientation === 'horizontal') {
      if (col + piece.length > 10) return false; // Out of bounds
      for (let i = 0; i < piece.length; i++) {
        if (this.board[row][col + i] !== null && this.board[row][col + i] !== 'hover') return false;
      }
      return true;
    } else {
      if (row + piece.length > 10) return false; // Out of bounds
      for (let i = 0; i < piece.length; i++) {
        if (this.board[row + i][col] !== null && this.board[row + i][col] !== 'hover') return false;
      }
      return true;
    }
  }

  placePiece(piece, row, col) {
    if (!this.checkPlacement(piece, row, col)) {
      return false;
    }
    
    if (piece.orientation === 'horizontal') {
      for (let i = 0; i < piece.length; i++) {
        this.board[row][col + i] = piece;
        return true;
      }
    } else {
      for (let i = 0; i < piece.length; i++) {
        this.board[row + i][col] = piece;
        return true;
      }
    }
    return false; // Placement failed
  }
}

export { Player };
