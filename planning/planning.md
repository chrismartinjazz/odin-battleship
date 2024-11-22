# Make Battleship

## About Battleship

### Equipment

- 2 gameboard grids per player (upper and lower).
  - Lower grid has player's ships
  - Upper grid is record of hits 'X' and misses 'O' for that player
- 5 ships per player
  - Carrier: 5
  - Battleship: 4
  - Cruiser (1990 version): 3 / Destroyer (2002 version): 3
  - Submarine: 3
  - Destroyer (1990 version): 2 / Patrol Boat (2002 version): 2

### Setup

- The board consists of a 10x10 grid.
  - The columns are labelled 1, 2, 3... 10
  - The rows are labelled A, B, C... J
- Each player's game boards are invisible to the other player.
- Ships are placed horizontally and vertically on a grid
- Ships cannot go off the grid
- Ships can touch each other
- Ships cannot overlap
- Ships cannot be moved once the game starts
- Red pegs indicate hits 🔴. White pegs indicate hits ⚪.

### Gameplay

- Players take turns to fire a shot
- A turn consists of:
  - Active player calls out a grid coordinate, row name followed by letter name
    - e.g. "D3" for row 4 column 
  - Inactive player responds:
    - "hit ship.name" or "miss"
    - If this has sunk a ship, says "You sunk my ship.name"
  - Active player records result on their upper board
    - Red peg for a hit
    - White peg for a misss
    - Sunk ships on top of board (red pegs)
  - Inactive player records hits (only) on their lower board
- The game is over if the inactive player has no remaining unsunk ships
- Turn passes to the next player

### Variations

- Pen and paper versions may play with any size board and number and size of ships
- Salvo version:
  - Each round, fire 1 shot for each remaining ship. Record on upper board with white pegs.
  - Opponent announces any hits and which ship for each hit. Change white pegs to red for hits.
- "Not announcing which ship is hit" is listed as a variation for Salvo in the Milton Bradley rules. This is also a common variation for original Battleship.

### My implementation

- I'll use the 2002 ship names and standard 10x10 grid size, but I want both of these to be flexible / extensible later as it would be cool to have a 'Star Wars' version with different ship names, or an option for a very large grid and more ships, etc.

## Objects / Classes required

I'll use Classes as I like the syntax.

I'll use a two element array for coordinates throughout e.g. `[4, 3]` would be D3. Nothing internal will reference the row names as letters - this will just be in the display.

The Application will hold a list of ships with their names and lengths, this allows conversion to a different set of ship names, number of ships, lengths if needed.

```js
const shipNames = {
  {name: "Carrier", length: 5},
  {name: "Battleship", length: 4},
  {name: "Destroyer", length: 3},
  {name: "Submarine", length: 3},
  {name: "Patrol Boat", length: 2},
}
```

### Ship(length)

- properties
  - length: 5, hits: 0, sunk: false
- functions
  - hit(): no return, isSunk(): boolean return

### GameBoard(size, ships)

Although the physical board game has an upper and lower board, this is just keeping track of:

- my ship locations
- which coordinates on my ships have been hit
- coordinates I've fired at
- results of those shots

There is no need for an actual 2D game board array recording squares that have not been hit. Do need to record hits received, to make sure don't hit a ship twice on the same square.

- properties
  - ships: Ship objects, the squares they occupy
  - hitsReceived: list of hits received (to ensure don't hit a ship twice)
  - shotsFired: array of all shots fired with coordinates and results
- functions
  - placeShip(coordinates)
  - receiveAttack(coordinates)
  - allShipsSunk()

### Player

Can be human or computer. Use basic class inheritance for this.

- makeMove(coordinates)
- Holds a GameBoard object.

### Application

- shipNames: Names and lengths of ships for initialization purposes
- Holds the Player objects.