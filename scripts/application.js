import { Player } from "./player.js";
import { coordinateFromString } from "./coordinate.js";
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

    this.randomizeShipsButton = document.querySelector(".randomize-ships");
    this.randomizeShipsButton.addEventListener(
      "click",
      this.handleRandomizeShips,
      {
        once: true,
      },
    );

    if (this.settings.shipPlacement === "random") {
      this.randomShipPlacement();
    } else {
      this.manualShipPlacement();
    }

    this.display.updateDisplay(this.currentPlayer);
    this.setGameLoop();
  }

  reset() {
    // Remove all EventListeners
    this.randomizeShipsButton.removeEventListener(
      "click",
      this.handleRandomizeShips,
    );
    this.display.p1OpponentBoard.removeEventListener(
      "click",
      this.handleGameLoop,
    );
    this.display.p2OpponentBoard.removeEventListener(
      "click",
      this.handleGameLoop,
    );

    // Clear event timers from Application and Display
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
    // Restart the app with random ship placement for both players.
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
    // If the move is invalid reset the game loop. If the game is
    // over run show the game over screen.
    const result = this.takeTurn(coordinateFromString(coordinateString));
    if (result === "invalid move") {
      this.setGameLoop();
      return;
    } else if (result === "game over") {
      this.gameOver(this.currentPlayer);
      return;
    }

    // If the next player is human, swap board and reset the game loop
    if (this.currentPlayer.type === "human") {
      this.display.swapDisplay(result);
      this.setGameLoop();
    } else if (this.currentPlayer.type === "computer") {
      // otherwise, next player is computer - take computer turn and swap player.
      // Simulate 'thinking time' for the computer.
      this.timeoutId = setTimeout(() => {
        const result = this.takeTurn(this.currentPlayer.chooseCoordinate());
        if (result === "game over") {
          this.gameOver(this.currentPlayer);
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

  gameOver(winner) {
    this.display.showGameOverDialog(
      winner.toString() === "p1" ? "Player One" : "Player Two",
    );
    this.reset();
    this.init(this.settings);
  }
}
