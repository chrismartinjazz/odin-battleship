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

    this.randomShipPlacement();
    this.display.updateDisplay();
    const randomizeShipsButton = document.querySelector(".randomize-ships");
    randomizeShipsButton.addEventListener(
      "click",
      () => {
        this.init(this.size, this.shipDetails);
      },
      { once: true },
    );
    this.setGameLoop();
  }

  randomShipPlacement() {
    this.playerOne.placeShipsRandom(this.shipDetails);
    this.playerTwo.placeShipsRandom(this.shipDetails);
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
        if (result === "invalid move") {
          this.setGameLoop();
          return;
        } else if (result === "game over") {
          alert(`${this.currentPlayer.toString()} wins!`);
          this.init(this.size, this.shipDetails);
          return;
        }

        // If the next player is human, reset the game loop with new board
        if (this.currentPlayer.type === "human") {
          this.setGameLoop();
        } else {
          // current player is computer - take computer turn and swap player.
          setTimeout(() => {
            this.takeTurn(this.currentPlayer.chooseCoordinate());
            this.setGameLoop();
          }, 700);
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
    if (!result) return "invalid move";
    this.currentPlayer.gameBoard.updateShotsFired(result);
    this.display.updateDisplay();
    if (this.inactivePlayer.gameBoard.allShipsSunk()) {
      return "game over";
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
}
