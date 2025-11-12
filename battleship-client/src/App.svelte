<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import Board from './lib/Board.svelte'
  import Piece from './lib/Piece.svelte'
  import ChangeOrientationButton from './lib/ChangeOrientationButton.svelte'
  import GameStatus from './lib/GameStatus.svelte'
  import { WebsocketClient } from './lib/WebsocketClient.js'

  const wsClient = new WebsocketClient('ws://localhost:8080');
  
  let selectedPiece = $state(null);
  let board = $state(Array(10).fill(null).map(() => Array(10).fill(null)));
  let gameStatus = $state('Waiting for opponent...');
  let pieces = $state({
    '1': { length: 5, orientation: 'horizontal', placed: false },
    '2': { length: 3, orientation: 'vertical', placed: false },
    '3': { length: 3, orientation: 'horizontal', placed: false },
    '4': { length: 4, orientation: 'vertical', placed: false },
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
    console.log(`Clicked cell at [${row}, ${col}]`);
    if (selectedPiece) {
      console.log(`Placing piece ${selectedPiece} at [${row}, ${col}]`);
      const piece = pieces[selectedPiece];
      
      // Check if placement is valid
      if (piece.orientation === 'horizontal') {
        if (col + piece.length > 10) return; // Out of bounds
        for (let i = 0; i < piece.length; i++) {
          if (board[row][col + i] !== null && board[row][col + i] !== 'hover') return;
        }
        for (let i = 0; i < piece.length; i++) {
          board[row][col + i] = selectedPiece;
        }
      } else {
        if (row + piece.length > 10) return; // Out of bounds
        for (let i = 0; i < piece.length; i++) {
          if (board[row + i][col] !== null && board[row + i][col] !== 'hover') return;
        }
        for (let i = 0; i < piece.length; i++) {
          board[row + i][col] = selectedPiece;
        }
      }
      
      // Deselect piece after placement
      selectedPiece = null;
      piece.placed = true;
    }
  }
</script>

<main>
  <h1>BATTLESHIP</h1>

  <GameStatus status={gameStatus}/>

  <Board board={board} onCellClick={handleCellClick} onCellHover={handleCellHover}/>

  {#if !pieces['1'].placed}<Piece id="1" size={pieces['1'].length} orientation={pieces['1'].orientation} selected={selectedPiece === '1'} onSelect={handleSelect} />{/if}  
  {#if !pieces['2'].placed}<Piece id="2" size={pieces['2'].length} orientation={pieces['2'].orientation} selected={selectedPiece === '2'} onSelect={handleSelect} />{/if}
  {#if !pieces['3'].placed}<Piece id="3" size={pieces['3'].length} orientation={pieces['3'].orientation} selected={selectedPiece === '3'} onSelect={handleSelect} />{/if}
  {#if !pieces['4'].placed}<Piece id="4" size={pieces['4'].length} orientation={pieces['4'].orientation} selected={selectedPiece === '4'} onSelect={handleSelect} />{/if}

  {#if !Object.values(pieces).every(piece => piece.placed)}<ChangeOrientationButton onOrientationChange={handleOrientationChange}/>{/if}


  
</main>

<style>

  h1 {
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
    color: #00008B;
  }
</style>
