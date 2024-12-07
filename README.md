# odin-battleship

Created as part of [The Odin Project](https://www.theodinproject.com/).

A one or two-player version of Battleship. Two-player modes are single device, with a dialog prompting users to give device to other player between moves.

Random and manual ship placement both supported.

If the user presses the 'Esc' key to exit out of dialogs before or part-way through placing ships, the application places remaining ships randomly and starts the game.

## Dependencies

Uses ESLint and Prettier. Jest for testing. Babel-jest to allow use of jest with module syntax.

## Classes

- Application: holds all elements together and drives the game sequence, using dialogs and event listeners. Built with a particular size (10 by default) and list of ships (Battleship 2002 version by default), set in `main.js`. To change the board size or the ship names, number, sizes, edit the `defaultSettings` object in `main.js`.
- DialogManager: helper class to initialize dialogs, and handle their opening, closing, and adding / removing of listeners.
- Display: class to manage initializing and updating the display, as well as swapping the display between turns.
- Player: holds a GameBoard and a BattleshipAi. Can be a human or computer player with methods to randomly place all ships, and attack coordinates.
- BattleshipAi: helper class to choose a coordinate for computer player. Works through three levels of target priorities:
  - Random selection of target coordinate, preferring a coordinate with empty space around it.
  - 'Search' around isolated hits, randomly selecting each adjacent coordinate until a second hit occurs.
  - Attack the ends of 'lines' of hits, where no target has reported 'sunk', to sink ships once found.
- GameBoard: Holds ships. Includes functions to receive and process attacks, place and remove ships, and determine if the game is over.
- Ship: Has a particular length and a number of hits. Functions to determine if it is sunk, and to hit it.
- Coordinate: Fundamental unit of the game, expressed as an object with row and col values. E.g. the top left cell would be `new Coordinate(0,0)`. Range of functions to work with coordinates including check if 2 coordinates are equal, are in a particular range, if a coordinate is in a list, add a vector to a coordinate, convert to Text (e.g. A1) or to String (e.g. "0,0").

## Modules

- Coordinate: The Coordinate class sits alongside helper functions to validate coordinates, generate a line of coordinates (assists in ship placement), generate a coordinate from a string, and standardizes the 4 direction vectors (in order right, down, left, up).
- dialog-template: Holds a set of html templates in an object to assist in building dialogs.
- drag-helpers: Holds a set of functions to assist in enabling drag for manual ship placement. Most are very simple, but the dragDrop function is relatively complex. Separation of concerns achieved by using a function constructor here.
- display-helpers: A single function, makeElement, to streamline creation of elements and adding classes and text.

## Display

The display attempts to mirror the traditional "Battleship" setup for an individual player - the upper board is the record of hits and misses on the opponent, and the lower board is the record of hits and misses on the player. The list of ships at the top represents the opponents ships and keeps track of how many are sunk for the player. The game is over when either player has lost all of their ships.

The board cells each store a data value with a coordinate, and a single event listener on the board translates clicks to attacks on the opponent.

Styling is very simple, with rounded white and red 'pegs' representing hits and misses and a plain set of boards and background. Color scheme is derived from an [image on the Wikipedia page for Battleship (game)](https://en.wikipedia.org/wiki/Battleship_(game)#/media/File:Flickr_-_Official_U.S._Navy_Imagery_-_Sailors_play_%22Battleship%22_aboard_a_carrier.jpg), depicting players on the carrier ship *USS George H.W. Bush*.

## Testing

The brief was to create this using TDD, and I did this for the core classes of Ship, Coordinate, Player, GameBoard. Most of these tests are now superfluous as they are testing internal logic, but I have left them in as a record for myself of how I built the classes. I then returned to testing when I was building the Battleship AI.

## Reflections

This was a very interesting project to work on. Creating the console version had particular challenges that led to me creating the Coordinate class and module. Getting this consistent language for the board, ship placement, attacks and misses was the first hurdle.

The display was also interesting to implement, particularly managing the attack sequence on the board and using setTimeOut to simulate "thinking" time for the computer, plus provide time for a human player in two player mode to see the outcome of their attack.

Late in the piece I decided to implement drag and drop ship placement. This necessitated a large-scale refactor as the application control logic now had to be very tight, to enable a sequence of dialogs to be shown and acted on by the player. Application control logic had seeped into the Display class, as I initially implemented dialogs within Display. Once I had pulled this back into Application and separated out the Dialogs, it became manageable to control the game initialization with a series of `eventListeners`.

Drag and drop itself was then a challenge - there are a range of ways to implement this and I chose to transfer the data from the dragged ship to the event on pickup, and then use this data to trigger placement of the ship on the board.

Finally the AI was a very satisfying challenge, as it was possible to implement a 'human-like' AI capable of beating an unskilled human player with only about 100 lines of actual code. There are further refinements that could be added such as:

- Randomly not always prefer squares with space around them - makes it a little predictable.
- Check length of row of hits when determining if the ship is sunk or not - it can be 'tricked' by a row of 3 hits with a sunk patrol boat, and not recognising that a hit on the end must be an isolated hit.

I have kept my working document `planning/planning.md` in the repo which is a record of my thinking particularly in the early phase of the project.
