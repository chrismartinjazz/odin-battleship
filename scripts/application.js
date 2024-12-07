import { DialogManager } from "./dialog-manager.js";
import { Player } from "./player.js";
import { Display } from "./display.js";
import { coordinateFromString } from "./coordinate.js";
import {
  drag,
  dragAllowDrop,
  createDragDropHandler,
  dragEnter,
  dragLeave,
} from "./drag-helpers.js";

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
    this.initializeDisplay(shipPlacement);
  }

  initializeDisplay(shipPlacement) {
    this.display = new Display(
      this.size,
      this.shipDetails,
      this.playerOne,
      this.playerTwo,
    );

    this.initializeRandomizeShipsButton();
    this.placeShips(shipPlacement);
  }

  placeShips(shipPlacement) {
    if (shipPlacement === "random") {
      this.playerOne.placeShipsRandom(this.shipDetails);
      this.playerTwo.placeShipsRandom(this.shipDetails);
      this.display.updateDisplay(this.currentPlayer);
      this.setGameLoop();
    } else if (shipPlacement === "manual") {
      this.setupShipPlacementDialog(this.playerOne);

      this.dialogManager.addClickListener("ship-placement-p1", () => {
        if (this.playerOne.gameBoard.ships.length === this.shipDetails.length) {
          this.dialogManager.closeDialog("ship-placement-p1");
          if (this.playerTwo.type === "computer") {
            this.playerTwo.placeShipsRandom(this.shipDetails);
            this.display.updateDisplay(this.currentPlayer);
            this.setGameLoop();
          } else if (this.playerTwo.type === "human") {
            this.nextShipPlacement();
          }
        }
      });

      this.dialogManager.showDialog("ship-placement-p1");
    } else {
      throw new Error("Unexpected value for shipPlacement");
    }
  }

  setupShipPlacementDialog(player) {
    // Clear the playerBoard if it already exists
    const existingBoard = document.querySelector(
      `.ship-placement-${player.toString()}__board`,
    );
    if (existingBoard) this.display.clearBoard(existingBoard, "cell");

    // Procedurally construct the ships and board in the ship placement dialog
    const shipPlacementPXShips = document.querySelector(
      `.ship-placement-${player.toString()}__ships`,
    );
    this.display.initializeShips(shipPlacementPXShips, true);
    const shipPlacementPXBoard = document.querySelector(
      `.ship-placement-${player.toString()}__board`,
    );
    shipPlacementPXBoard.classList.add("board");
    this.display.initializeBoard(
      shipPlacementPXBoard,
      `ship-placement-${player.toString()}__board`,
      "cell clickable",
    );

    // Add dragging functionality to board
    player.gameBoard.removeAllShips();
    shipPlacementPXBoard.addEventListener("dragover", dragAllowDrop);
    shipPlacementPXBoard.addEventListener("dragenter", dragEnter);
    shipPlacementPXBoard.addEventListener("dragleave", dragLeave);
    const dragDropHandler = createDragDropHandler(
      player,
      this.shipDetails,
      this.display,
      `ship-placement-${player.toString()}__board`,
    );
    shipPlacementPXBoard.addEventListener("drop", dragDropHandler);

    const shipListItems =
      shipPlacementPXShips.querySelectorAll("li[draggable=true]");
    for (const ship of shipListItems) {
      ship.addEventListener("dragstart", drag);
    }
  }

  nextShipPlacement() {
    this.dialogManager.showDialog("next-ship-placement");
    this.dialogManager.addClickListener("next-ship-placement", () => {
      this.dialogManager.closeDialog("next-ship-placement");

      // If player two has already placed ships, start the game.
      // Otherwise, proceed to place ships for player two.
      if (this.playerTwo.gameBoard.ships.length === 5) {
        this.display.updateDisplay(this.currentPlayer);
        this.setGameLoop();
      } else {
        this.placeShipsPlayerTwo();
      }
    });
  }

  placeShipsPlayerTwo() {
    this.setupShipPlacementDialog(this.playerTwo);

    this.dialogManager.addClickListener("ship-placement-p2", () => {
      if (this.playerTwo.gameBoard.ships.length === this.shipDetails.length) {
        this.dialogManager.closeDialog("ship-placement-p2");
        this.dialogManager.showDialog("next-ship-placement");
      }
    });

    this.dialogManager.showDialog("ship-placement-p2");
  }

  initializeRandomizeShipsButton() {
    this.randomizeShipsButton = document.querySelector(".randomize-ships");
    this.randomizeShipsButton.addEventListener(
      "click",
      () => {
        this.createPlayers(this.playerTwo.type, "random");
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
      this.dialogManager.initializeDialogs();
      this.getPlayerChoices();
    });
    this.dialogManager.showDialog("game-over");
  }
}
