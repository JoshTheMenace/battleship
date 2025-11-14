<script>
  import Board from './lib/Board.svelte'
  import Piece from './lib/Piece.svelte'
  import ChangeOrientationButton from './lib/ChangeOrientationButton.svelte'
  import GameStatus from './lib/GameStatus.svelte'
  import { WebsocketClient } from './lib/WebsocketClient.js'

  let selectedPiece = $state(null);
  let board = $state(Array(10).fill(null).map(() => Array(10).fill(null)));
  let attackingBoard = $state(Array(10).fill(null).map(() => Array(10).fill(null)));
  
  const wsClient = new WebsocketClient('ws://localhost:8080', {
    onBoardUpdate: (updatedBoard) => {
      board = updatedBoard;
    },
    onPiecePlaced: (piece) => {
      pieces[piece.id].placed = true;
    },
    onAttackResponse: (result, row, col, playerId) => {
      console.log(`Attack response: ${result} at [${row}, ${col}]`);
      if(playerId === wsClient.player.id) {
        board[row][col] = result;
      } else {
        
        attackingBoard[row][col] = result;
      }
    },
    onTurnUpdate: (turn) => {
      console.log(`Turn: ${turn}`);
      let yourTurn = turn === wsClient.player.id;
      if(yourTurn) {
        gameStatus = 'It\'s your turn';
      } else {
        gameStatus = 'It\'s opponent\'s turn';
      }
    },
    onGameOver: (winner) => {
      console.log('Game over:', winner);
      gameStatus = 'Game over';
      if (winner === wsClient.player.id) {
        gameStatus = 'You won!';
      } else {
        gameStatus = 'You lost!';
      }
    }
  });
  let gameStatus = $state('Waiting for opponent...');
  let pieces = $state({
    '1': { length: 5, orientation: 'horizontal', placed: false },
    '4': { length: 4, orientation: 'horizontal', placed: false },
    '2': { length: 3, orientation: 'horizontal', placed: false },
    '3': { length: 3, orientation: 'horizontal', placed: false },
    '5': { length: 2, orientation: 'horizontal', placed: false },
    
  });

  function handleSelect(id) {
    console.log(`Selected piece ${id}`);
    if (selectedPiece === id) {
      selectedPiece = null;
    } else {
      selectedPiece = id;
    }
  }

  function handleOrientationChange() {
    if (selectedPiece) {
      const piece = pieces[selectedPiece];
      piece.orientation = piece.orientation === 'horizontal' ? 'vertical' : 'horizontal';
    }
  }

  function handleCellHover(row, col) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] == 'hover') {
          board[i][j] = null;
        }
      }
    }
    
    if (!selectedPiece) return;
    const piece = pieces[selectedPiece];
    if (piece.orientation === 'horizontal') {
      if (col + piece.length > 10) return;
      for (let i = 0; i < piece.length; i++) {
        if (board[row][col + i] !== null) {
          return;
        }
      }
      for (let i = 0; i < piece.length; i++) {
        board[row][col + i] = 'hover';
      }
    } else {
      if (row + piece.length > 10) return;
      for (let i = 0; i < piece.length; i++) {
        if (board[row + i][col] !== null) {
          return;
        }
      }
      for (let i = 0; i < piece.length; i++) {
        board[row + i][col] = 'hover';
      }
    }
  }

  function handleCellClick(row, col) {
    // console.log(`Clicked cell at [${row}, ${col}]`);
    if (selectedPiece) {
      console.log(`Placing piece ${selectedPiece} at [${row}, ${col}]`);
      const piece = pieces[selectedPiece];
      
      wsClient.sendMessage(JSON.stringify({ 
        type: 'placePiece', 
        playerId: wsClient.player.id, 
        piece: { 
          id: selectedPiece, 
          length: piece.length, 
          orientation: piece.orientation 
        }, 
        row: row, 
        col: col 
      }));
      
      // Deselect piece after placement
      selectedPiece = null;
      // piece.placed = true;

    }
  }

  function handleAttackingCellClick(row, col) {
    console.log(`Attacking cell at [${row}, ${col}]`);
    if(attackingBoard[row][col] == 'hit' || attackingBoard[row][col] == 'miss') return;
    wsClient.sendMessage(JSON.stringify({ 
      type: 'attack', 
      playerId: wsClient.player.id, 
      row: row, 
      col: col 
    }));
  }

  function handleAttackingCellHover(row, col) {
    for (let i = 0; i < attackingBoard.length; i++) {
      for (let j = 0; j < attackingBoard[i].length; j++) {
        if (attackingBoard[i][j] == 'attack') {
          attackingBoard[i][j] = null;
        }
      }
    }
    if(attackingBoard[row][col] == 'hit' || attackingBoard[row][col] == 'miss') return;
    attackingBoard[row][col] = 'attack';
  }

  function handleReady() {
    wsClient.sendMessage(JSON.stringify({ 
      type: 'ready', 
      playerId: wsClient.player.id 
    }));
  }
</script>

<main>
  <h1>BATTLESHIP</h1>

  <GameStatus status={gameStatus}/>
  <div class="boards">
    <div class="board-container">
      <h2>Defending Board</h2>
    <Board board={board} onCellClick={handleCellClick} onCellHover={handleCellHover}/>
    </div>
    <div class="board-container">
      <h2>Attacking Board</h2>
      <Board board={attackingBoard} onCellClick={handleAttackingCellClick} onCellHover={handleAttackingCellHover}/>
    </div>
  </div>

  {#if !pieces['1'].placed}<Piece id="1" size={pieces['1'].length} orientation={pieces['1'].orientation} selected={selectedPiece === '1'} onSelect={handleSelect} />{/if}  
  {#if !pieces['2'].placed}<Piece id="2" size={pieces['2'].length} orientation={pieces['2'].orientation} selected={selectedPiece === '2'} onSelect={handleSelect} />{/if}
  {#if !pieces['3'].placed}<Piece id="3" size={pieces['3'].length} orientation={pieces['3'].orientation} selected={selectedPiece === '3'} onSelect={handleSelect} />{/if}
  {#if !pieces['4'].placed}<Piece id="4" size={pieces['4'].length} orientation={pieces['4'].orientation} selected={selectedPiece === '4'} onSelect={handleSelect} />{/if}
  {#if !pieces['5'].placed}<Piece id="5" size={pieces['5'].length} orientation={pieces['5'].orientation} selected={selectedPiece === '5'} onSelect={handleSelect} />{/if}
  
  {#if !Object.values(pieces).every(piece => piece.placed)}<ChangeOrientationButton onOrientationChange={handleOrientationChange}/>{/if}
  {#if (Object.values(pieces).every(piece => piece.placed) && gameStatus == 'Waiting for opponent...')}<button onclick={handleReady}>Ready</button>{/if}

  
</main>

<style>

  h1 {
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
    color: #00008B;
  }
  .boards {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }
  .board-container {
    border: 1px solid black;
    padding: 1rem;
    border-radius: 1rem;
    color: black;
  }
</style>
