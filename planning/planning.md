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

```txt
A1 A2 A3 A4 A5 A6 A7 A8 A9 A10
B1 B2 B3 B4 B5 B6 B7 B8 B9 B10
C1 C2 C3 C4 C5 C6 C7 C8 C9 C10
D1 D2 D3 D4 D5 D6 D7 D8 D9 D10
E1 E2 E3 E4 E5 E6 E7 E8 E9 E10
F1 F2 F3 F4 F5 F6 F7 F8 F9 F10
G1 G2 G3 G4 G5 G6 G7 G8 G9 G10
H1 H2 H3 H4 H5 H6 H7 H8 H9 H10
I1 I2 I3 I4 I5 I6 I7 I8 I9 I10
J1 J2 J3 J4 J5 J6 J7 J8 J9 J10


COORDINATES
 0,0  0,1  0,2  0,3  0,4  0,5  0,6  0,7  0,8  0,9  0,10
 1,0  1,1  1,2  1,3  1,4  1,5  1,6  1,7  1,8  1,9  1,10
 2,0  2,1  2,2  2,3  2,4  2,5  2,6  2,7  2,8  2,9  2,10
 3,0  3,1  3,2  3,3  3,4  3,5  3,6  3,7  3,8  3,9  3,10
 4,0  4,1  4,2  4,3  4,4  4,5  4,6  4,7  4,8  4,9  4,10
 5,0  5,1  5,2  5,3  5,4  5,5  5,6  5,7  5,8  5,9  5,10
 6,0  6,1  6,2  6,3  6,4  6,5  6,6  6,7  6,8  6,9  6,10
 7,0  7,1  7,2  7,3  7,4  7,5  7,6  7,7  7,8  7,9  7,10
 8,0  8,1  8,2  8,3  8,4  8,5  8,6  8,7  8,8  8,9  8,10
 9,0  9,1  9,2  9,3  9,4  9,5  9,6  9,7  9,8  9,9  9,10
10,0 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9 10,10

VECTORS
        [-1, 0]
[0, -1]         [0, 1]
        [1, 0]

EXAMPLE LAYOUT OF 5 SHIPS
 0,0X 0,1X 0,2X 0,3X 0,4X 0,5  0,6  0,7  0,8  0,9  0,10
 1,0  1,1  1,2  1,3  1,4  1,5  1,6  1,7  1,8  1,9  1,10
 2,0  2,1  2,2  2,3X 2,4  2,5  2,6  2,7  2,8  2,9  2,10
 3,0  3,1  3,2  3,3X 3,4  3,5  3,6  3,7  3,8X 3,9  3,10
 4,0  4,1  4,2  4,3X 4,4  4,5  4,6  4,7  4,8X 4,9  4,10
 5,0  5,1  5,2  5,3X 5,4  5,5  5,6  5,7  5,8X 5,9  5,10
 6,0  6,1  6,2  6,3  6,4  6,5  6,6  6,7  6,8  6,9  6,10
 7,0  7,1  7,2  7,3  7,4  7,5  7,6  7,7  7,8  7,9  7,10
 8,0  8,1  8,2  8,3  8,4X 8,5X 8,6X 8,7  8,8  8,9  8,10
 9,0  9,1  9,2  9,3  9,4  9,5  9,6  9,7  9,8  9,9  9,10
10,0 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9X 10,10X
```

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

Key decision - should the GameBoard calculate the coordinates of the ship to be placed, given a start and end coordinate? Or should it just take a ship index and full array of coordinates?

Either way a calcShipCoordinates method sounds useful.

- parameters: starting coordinates, direction vector, length.

### Player

- Holds a GameBoard object.
- AI player can selectMove() based on its own GameBoard state.
- By default, player one is human, player two is computer.
  - Computer makes random moves (but not same move twice).

### Application

- shipNames: Names and lengths of ships for initialization purposes.
- Holds the Player objects.
- Manages the game sequence.

## Pseudocode

- Initialize Application
- Initialize Player 1 and Player 2
  - testing: both human
- Place ships on boards
  - testing: pre-determined
- Set player 1 as active player
- Each turn:
  - Active player selects square to attack
  - Inactive player reports on result of attack
  - Active player records result of attack
  - If all ships are sunk for inactive player, game is over
  - Otherwise, rotate turn.

## Modifications to add

- DONE Button to randomize ship placement and start a new game.
- DONE OpponentShips updates as ships are destroyed.
- DONE one player mode - p2 board is hidden
- DONE computer shoots cells adjacent to hits first.
- two player mode - dialog to pass screen between each player.
