import { Player } from "./player.js";
import { Coordinate, coordinateFromString } from "./coordinate.js";
import { Display } from "./display.js";

export class Application {
  constructor(settings) {
    this.init(settings);
  }

  init(settings) {
    this.settings = settings;
    this.timeoutId = null;
    this.playerOne = new Player(this.settings.size, "p1", "human");
    this.playerTwo = new Player(
      this.settings.size,
      "p2",
      this.settings.opponentType,
    );
    this.currentPlayer = this.playerOne;
    this.inactivePlayer = this.playerTwo;
    this.display = new Display(
      this.settings.size,
      this.settings.shipDetails,
      this.playerOne,
      this.playerTwo,
    );

    if (this.settings.shipPlacement === "random") {
      this.randomShipPlacement();
    } else {
      this.manualShipPlacement();
    }
    console.log("running updateDisplay on:", this.currentPlayer);
    this.display.updateDisplay(this.currentPlayer);

    const randomizeShipsButton = document.querySelector(".randomize-ships");
    randomizeShipsButton.addEventListener("click", this.handleRandomizeShips, {
      once: true,
    });

    this.setGameLoop();
  }

  reset() {
    this.randomizeShipsButton.removeEventListener(this.handleRandomizeShips);
    this.display.p1OpponentBoard.removeEventListener(this.handleGameLoop);
    this.display.p2OpponentBoard.removeEventListener(this.handleGameLoop);
    if (this.timeoutId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.display.timeoutId) {
      clearTimeout(this.display.timerId);
      this.display.timerId = null;
    }
  }

  randomShipPlacement() {
    this.playerOne.placeShipsRandom(this.settings.shipDetails);
    this.playerTwo.placeShipsRandom(this.settings.shipDetails);
  }

  manualShipPlacement() {
    // For now, this will just be the same as random. TODO - add manual placement.
    this.randomShipPlacement();
  }

  setGameLoop() {
    // Add to the 'opponent board' of the current player
    const board = this.currentPlayerOpponentBoard();
    board.addEventListener("click", this.handleGameLoop, { once: true });
  }

  handleRandomizeShips = () => {
    this.settings.shipPlacement === "random";
    this.reset;
    this.init(this.settings);
  };

  handleGameLoop = (event) => {
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
      this.reset();
      this.init(this.settings);
      return;
    }

    // If the next player is human, swap board and reset the game loop
    if (this.currentPlayer.type === "human") {
      this.display.swapDisplay(result);
      this.setGameLoop();
    } else if (this.currentPlayer.type === "computer") {
      // next player is computer - take computer turn and swap player.
      this.timeoutId = setTimeout(() => {
        const result = this.takeTurn(this.currentPlayer.chooseCoordinate());
        if (result === "game over") {
          alert(`${this.currentPlayer.toString()} wins!`);
          this.reset();
          this.init(this.settings);
        }
        this.setGameLoop();
        this.timerId = null;
      }, 700);
    } else {
      throw new Error("Unexpected value for this.currentPlayer");
    }
  };

  currentPlayerOpponentBoard() {
    return this.currentPlayer == this.playerOne
      ? this.display.p1OpponentBoard
      : this.display.p2OpponentBoard;
  }

  takeTurn(coordinate) {
    const result = this.inactivePlayer.gameBoard.receiveAttack(coordinate);
    if (!result) return "invalid move";
    this.currentPlayer.gameBoard.updateShotsFired(result);
    if (this.inactivePlayer.gameBoard.allShipsSunk()) {
      return "game over";
    }
    this.swapCurrentPlayer();
    this.display.updateDisplay(this.currentPlayer);
    return result;
  }

  swapCurrentPlayer() {
    this.currentPlayer =
      this.currentPlayer.toString() === "p1" ? this.playerTwo : this.playerOne;
    this.inactivePlayer =
      this.inactivePlayer.toString() === "p1" ? this.playerTwo : this.playerOne;
  }

  testPlaceShips(player) {
    for (let row = 0; row < this.settings.shipDetails.length; row++) {
      const start = new Coordinate(row, 0);
      const vector = new Coordinate(0, 1);
      player.gameBoard.placeShip(
        start,
        vector,
        this.settings.shipDetails[row].length,
      );
    }
  }
}
