import { DialogManager } from "./dialog-manager.js";
import { Player } from "./player.js";
import { Display } from "./display.js";
import { coordinateFromString } from "./coordinate.js";

export class Application {
  constructor({ size, shipDetails }) {
    this.size = size;
    this.shipDetails = shipDetails;

    this.dialogManager = new DialogManager();

    this.getPlayerChoices();
  }

  getPlayerChoices() {
    this.dialogManager.addSubmitListener("player-choices", (event) => {
      event.preventDefault();
      const opponentType = document.querySelector(
        'input[name="opponentType"]:checked',
      ).value;
      const shipPlacement = document.querySelector(
        'input[name="shipPlacement"]:checked',
      ).value;
      this.dialogManager.closeDialog("player-choices");
      this.createPlayers(opponentType, shipPlacement);
    });
    this.dialogManager.showDialog("player-choices");
  }

  createPlayers(opponentType, shipPlacement) {
    this.playerOne = new Player(this.size, "p1", "human");
    this.playerTwo = new Player(this.size, "p2", opponentType);
    this.currentPlayer = this.playerOne;
    this.inactivePlayer = this.playerTwo;
    this.placeShips(shipPlacement);
  }

  placeShips(shipPlacement) {
    if (shipPlacement === "random") {
      this.playerOne.placeShipsRandom(this.shipDetails);
      this.playerTwo.placeShipsRandom(this.shipDetails);
      this.initializeDisplay();
    } else {
      // TODO add place ships manually
      this.initializeDisplay();
    }
  }

  initializeDisplay() {
    this.display = new Display(
      this.size,
      this.shipDetails,
      this.playerOne,
      this.playerTwo,
    );
    this.display.updateDisplay(this.currentPlayer);

    this.initializeRandomizeShipsButton();
    this.setGameLoop();
  }

  initializeRandomizeShipsButton() {
    this.randomizeShipsButton = document.querySelector(".randomize-ships");
    this.randomizeShipsButton.addEventListener(
      "click",
      () => {
        console.log("clicked");
        this.placeShips("random");
      },
      { once: true },
    );
  }

  setGameLoop() {
    const board = this.currentPlayerOpponentBoard();
    board.addEventListener("click", this.handleGameLoop, { once: true });
  }

  handleGameLoop = (event) => {
    // Check the item targeted is a cell - reset game loop if not.
    // Store the clicked on coordinate in coordinateString.
    const coordinateString = event.target.getAttribute("data-coordinate");
    if (!coordinateString) {
      this.setGameLoop();
      return;
    }

    // Attack the inactive player.
    const result = this.takeTurn(coordinateFromString(coordinateString));

    // If the move is invalid reset the game loop. If the game is
    // over show the game over screen.
    if (result === "invalid move") {
      this.setGameLoop();
      return;
    } else if (result === "game over") {
      this.gameOver(this.currentPlayer);
      return;
    }

    this.swapCurrentPlayer();
    this.display.updateDisplay(this.currentPlayer);

    // If the next player is human, swap board and reset the game loop
    if (this.currentPlayer.type === "human") {
      this.nextPlayer(result);
      this.setGameLoop();
    } else if (this.currentPlayer.type === "computer") {
      // otherwise, next player is computer - take computer turn and swap player.
      // Simulate 'thinking time' for the computer.
      setTimeout(() => {
        const result = this.takeTurn(this.currentPlayer.chooseCoordinate());
        if (result === "game over") {
          this.gameOver(this.currentPlayer);
        } else if (result === "invalid move") {
          throw new Error("Invalid move reported by Application.takeTurn()");
        } else {
          this.swapCurrentPlayer();
          this.display.updateDisplay(this.currentPlayer);
          this.setGameLoop();
        }
      }, 700);
    } else {
      throw new Error(
        "Unexpected value for currentPlayer: ",
        this.currentPlayer,
      );
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
    return result;
  }

  nextPlayer(result) {
    this.updateSwapPlayersDialog(result);

    setTimeout(() => {
      this.dialogManager.showDialog("swap-players");
      this.display.swapDisplay();
    }, 700);
  }

  updateSwapPlayersDialog(result) {
    this.dialogManager.swapPlayersOutput.classList.remove("hit");
    this.dialogManager.swapPlayersOutput.innerHTML = `${result.coordinate.toText()}: ${result.result}`;
    if (result.sunk) {
      this.dialogManager.swapPlayersOutput.innerHTML += `<br>You sunk the ${this.shipDetails[result.sunk].name}`;
    }
    if (result.result === "hit") {
      this.dialogManager.swapPlayersOutput.classList.add("hit");
    }
  }

  swapCurrentPlayer() {
    this.currentPlayer =
      this.currentPlayer.toString() === "p1" ? this.playerTwo : this.playerOne;
    this.inactivePlayer =
      this.inactivePlayer.toString() === "p1" ? this.playerTwo : this.playerOne;
  }

  gameOver(winner) {
    const winnerText = winner.toString() === "p1" ? "Player One" : "Player Two";
    this.dialogManager.gameOverOutput.innerText = `${winnerText} wins!`;
    this.dialogManager.gameOverButton.addEventListener("click", () => {
      this.getPlayerChoices();
    });
    this.dialogManager.showDialog("game-over");
  }
}
