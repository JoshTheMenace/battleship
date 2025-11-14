# Battleship Game (CS 3380 Project)

A real-time multiplayer Battleship game with WebSocket communication, Svelte frontend, and Node.js backend.

## Tech Stack

**Backend:** Node.js + WebSocket (ws)  
**Frontend:** Svelte 5 + Vite

## Quick Start

### Install & Run

**Server:**
```bash
cd battleship-server
npm install
npm start
```
Server runs on `ws://localhost:8080`

**Client:**
```bash
cd battleship-client
npm install
npm run dev
```
Client runs on `http://localhost:5173`

### Play

Open the client URL in **two browser tabs** to play with two players.

## How to Play

1. **Place Ships:** Click ships, toggle orientation, click board cells to place (5 ships: length 5, 4, 3, 3, 2)
2. **Ready Up:** Both players click "Ready" when all ships placed
3. **Battle:** Take turns attacking opponent's board - click cells to fire
4. **Win:** Destroy all opponent ships first

**Symbols:**
- ❌ Hit
- ⚪ Miss  
- 🔳 Your ships

## Rules

- Ships can't overlap or go out of bounds
- Players alternate turns
- Can't see opponent's ships until hit

---

