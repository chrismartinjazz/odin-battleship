import { Player } from "./player.js";
import { Coordinate, coordinateFromString } from "./coordinate.js";
import { Display } from "./display.js";

export class Application {
  constructor(
    size = 10,
    shipDetails = [
      { name: "Carrier", length: 5 },
      { name: "Battleship", length: 4 },
      { name: "Destroyer", length: 3 },
      { name: "Submarine", length: 3 },
      { name: "Patrol Boat", length: 2 },
    ],
  ) {
    this.init(size, shipDetails);
  }

  init(size, shipDetails) {
    this.size = size;
    this.shipDetails = shipDetails;
    this.playerOne = new Player(size, "p1", "human");
    this.playerTwo = new Player(size, "p2", "computer");
    this.currentPlayer = this.playerOne;
    this.inactivePlayer = this.playerTwo;
    this.display = new Display(
      this.size,
      this.shipDetails,
      this.playerOne,
      this.playerTwo,
    );

    // For testing - TODO remove
    this.testPlaceShips(this.playerOne);
    this.testPlaceShips(this.playerTwo);
    //

    this.display.updateAllBoards();

    this.setGameLoop();
  }

  setGameLoop() {
    // Add to the 'opponent board' of the current player
    const board = this.currentPlayerOpponentBoard();
    board.addEventListener(
      "click",
      (event) => {
        // Check the item targeted is a cell - reset game loop if not.
        const coordinateString = event.target.getAttribute("data-coordinate");
        if (!coordinateString) {
          this.setGameLoop();
          return;
        }

        // Attack the inactive player and swap to the next player.
        // If the move is invalid or the game is over, reset the game loop.
        const result = this.takeTurn(coordinateFromString(coordinateString));
        if (!result) {
          this.setGameLoop();
          return;
        }

        // If the next player is human, reset the game loop with new board
        if (this.currentPlayer.type == "human") {
          this.setGameLoop();
        } else {
          // current player is computer - take computer turn and swap player.
          this.takeTurn(this.currentPlayer.chooseCoordinate());
          this.setGameLoop();
        }
      },
      { once: true },
    );
  }

  currentPlayerOpponentBoard() {
    return this.currentPlayer == this.playerOne
      ? this.display.p1OpponentBoard
      : this.display.p2OpponentBoard;
  }

  takeTurn(coordinate) {
    const result = this.inactivePlayer.gameBoard.receiveAttack(coordinate);
    if (!result) return false;
    this.currentPlayer.gameBoard.updateShotsFired(result);
    this.display.updateAllBoards();
    if (this.inactivePlayer.gameBoard.allShipsSunk()) {
      alert(`${this.currentPlayer.toString()} wins!`);
      this.init(this.size, this.shipDetails);
      return false;
    }
    this.swapCurrentPlayer();
    return result;
  }

  swapCurrentPlayer() {
    this.currentPlayer =
      this.currentPlayer == this.playerOne ? this.playerTwo : this.playerOne;
    this.inactivePlayer =
      this.inactivePlayer == this.playerOne ? this.playerTwo : this.playerOne;
  }

  testPlaceShips(player) {
    for (let row = 0; row < this.shipDetails.length; row++) {
      const start = new Coordinate(row, 0);
      const vector = new Coordinate(0, 1);
      player.gameBoard.placeShip(start, vector, this.shipDetails[row].length);
    }
  }

  resetApplication() {
    this.playerOne = new Player(this.size, "p1", "human");
    this.playerTwo = new Player(this.size, "p2", "computer");
    this.currentPlayer = this.playerOne;
    this.inactivePlayer = this.playerTwo;
    this.display = new Display(
      this.size,
      this.shipDetails,
      this.playerOne,
      this.playerTwo,
    );
  }
}
