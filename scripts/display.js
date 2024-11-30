export class Display {
  constructor(size, shipDetails, p1, p2) {
    this.size = size;
    this.shipDetails = shipDetails;
    this.p1 = p1;
    this.p2 = p2;
    this.p1OpponentShips = document.querySelector(".p1-opponent-ships");
    this.p1OpponentBoard = document.querySelector(".p1-opponent-board");
    this.p1PlayerBoard = document.querySelector(".p1-player-board");
    this.p2OpponentShips = document.querySelector(".p2-opponent-ships");
    this.p2OpponentBoard = document.querySelector(".p2-opponent-board");
    this.p2PlayerBoard = document.querySelector(".p2-player-board");
    this.dialogSwapPlayers = document.querySelector(".dialog-swap-players");
    this.dialogSwapPlayersResult = document.querySelector(
      ".dialog-swap-players__result",
    );
    this.dialogGameOver = document.querySelector(".dialog-game-over");
    this.dialogGameOverResult = document.querySelector(
      ".dialog-game-over__result",
    );

    this.timeoutId = null;

    this.initializeBoard(
      this.p1OpponentBoard,
      "p1-opponent-board",
      "cell clickable",
    );
    this.initializeBoard(
      this.p2OpponentBoard,
      "p2-opponent-board",
      "cell clickable",
    );
    this.initializeBoard(this.p1PlayerBoard, "p1-player-board", "cell");
    this.initializeBoard(this.p2PlayerBoard, "p2-player-board", "cell");
    this.initializeShips();

    this.playerOneDisplay = document.querySelector(".player-one-display");
    this.playerTwoDisplay = document.querySelector(".player-two-display");

    this.playerOneDisplay.style.display = "block";
    this.playerTwoDisplay.style.display = "none";

    this.initializeDialog(
      this.dialogSwapPlayers,
      ".dialog-swap-players__button",
    );

    this.initializeDialog(this.dialogGameOver, ".dialog-game-over__button");
  }

  initializeBoard(board, boardSelector, cellClasses) {
    board.innerHTML = "";

    // Add header row
    const myRowHeader = this.makeElement("div", "row header");
    myRowHeader.appendChild(this.makeElement("div", "cell"));
    for (let col = 0; col < this.size; col++) {
      myRowHeader.appendChild(
        this.makeElement("div", "cell header", (col + 1).toString()),
      );
    }
    board.appendChild(myRowHeader);

    // Add body rows
    for (let row = 0; row < this.size; row++) {
      const myRow = this.makeElement("div", "row");
      myRow.appendChild(
        this.makeElement("div", "cell header", String.fromCharCode(row + 65)),
      );
      for (let col = 0; col < this.size; col++) {
        const myCell = this.makeElement("div", cellClasses);
        myCell.setAttribute(
          "data-coordinate",
          `${row.toString()},${col.toString()}`,
        );
        myCell.setAttribute("data-board", boardSelector);
        myRow.appendChild(myCell);
      }
      board.appendChild(myRow);
    }
  }

  initializeShips() {
    this.p1OpponentShips.innerHTML = "";
    this.p2OpponentShips.innerHTML = "";

    for (const ship of this.shipDetails) {
      const myLiP1 = this.makeElement("li", "", ship.name);
      this.p1OpponentShips.append(myLiP1);
      const myLiP2 = this.makeElement("li", "", ship.name);
      this.p2OpponentShips.append(myLiP2);
    }
  }

  updateDisplay() {
    this.updateOpponentBoard(this.p1, "p1-opponent-board");
    this.updateOpponentBoard(this.p2, "p2-opponent-board");
    this.updatePlayerBoard(this.p1, "p1-player-board");
    this.updatePlayerBoard(this.p2, "p2-player-board");
    this.updateShips();
  }

  swapDisplay(result) {
    this.dialogSwapPlayersResult.classList.remove("hit");
    this.dialogSwapPlayersResult.innerText = `${result.coordinate.toText()}: ${result.result}`;
    if (result.sunk) {
      this.dialogSwapPlayersResult.innerHTML += `<br>You sunk the ${this.shipDetails[result.sunk].name}!`;
    }
    if (result.result === "hit") {
      this.dialogSwapPlayersResult.classList.add("hit");
    }
    this.timeoutId = setTimeout(() => {
      this.dialogSwapPlayers.showModal();
      if (this.playerOneDisplay.style.display === "none") {
        this.playerTwoDisplay.style.display = "none";
        this.playerOneDisplay.style.display = "block";
        this.timeOutId = null;
      } else if (this.playerTwoDisplay.style.display === "none") {
        this.playerOneDisplay.style.display = "none";
        this.playerTwoDisplay.style.display = "block";
        this.timeOutId = null;
      } else {
        this.timeOutId = null;
        return false;
      }
    }, 700);
  }

  showGameOverDialog(winner) {
    this.dialogGameOverResult.innerText = `${winner} wins!`;
    this.dialogGameOver.showModal();
  }

  updateOpponentBoard(player, dataBoard) {
    // Add 'hit' or 'miss' class to cells that have been hit / missed
    for (const shot of player.gameBoard.shotsFired) {
      const cell = document.querySelector(
        `[data-board="${dataBoard}"][data-coordinate="${shot.coordinate.toString()}"]`,
      );
      cell.classList.add(shot.result);
      cell.classList.remove("clickable");
    }
  }

  updatePlayerBoard(player, dataBoard) {
    // Add 'ship' class to cells that have a ship, also 'sunk' if that ship is sunk.
    for (const [shipIndex, shipRecord] of player.gameBoard.ships.entries()) {
      for (const coordinate of shipRecord.coordinates) {
        const cell = document.querySelector(
          `[data-board="${dataBoard}"][data-coordinate="${coordinate.toString()}"]`,
        );
        cell.classList.add("ship");
        cell.setAttribute("data-ship", shipIndex);
        if (shipRecord.ship.isSunk()) cell.classList.add("sunk");
      }
    }
    // Add hit and miss indicators to the player board
    for (const shot of player.gameBoard.shotsReceived) {
      const cell = document.querySelector(
        `[data-board="${dataBoard}"][data-coordinate="${shot.coordinate.toString()}"]`,
      );
      cell.classList.add(shot.result);
    }
  }

  updateShips() {
    let index, shipRecord;
    for ([index, shipRecord] of this.p2.gameBoard.ships.entries()) {
      if (shipRecord.ship.isSunk()) {
        this.p1OpponentShips.children[index].classList.add("sunk");
      }
    }
    for ([index, shipRecord] of this.p1.gameBoard.ships.entries()) {
      if (shipRecord.ship.isSunk()) {
        this.p2OpponentShips.children[index].classList.add("sunk");
      }
    }
  }

  initializeDialog(dialog, selector) {
    const closeButton = document.querySelector(selector);
    closeButton.addEventListener("click", () => {
      dialog.close();
    });
  }

  makeElement(htmlTag = "div", cssClass, text) {
    const myElement = document.createElement(htmlTag);
    if (cssClass) myElement.className = cssClass;
    if (text) myElement.innerText = text;
    return myElement;
  }
}
