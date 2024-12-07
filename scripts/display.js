import { makeElement } from "./display-helpers.js";

export class Display {
  constructor(size, shipDetails, p1, p2) {
    this.size = size;
    this.shipDetails = shipDetails;
    this.p1 = p1;
    this.p2 = p2;

    this.initializeDisplay();
  }

  initializeDisplay() {
    this.playerOneDisplay = document.querySelector(".player-one-display");
    this.playerTwoDisplay = document.querySelector(".player-two-display");

    this.p1OpponentShips = document.querySelector(".p1-opponent-ships");
    this.p1OpponentBoard = document.querySelector(".p1-opponent-board");
    this.p1PlayerBoard = document.querySelector(".p1-player-board");

    this.p2OpponentShips = document.querySelector(".p2-opponent-ships");
    this.p2OpponentBoard = document.querySelector(".p2-opponent-board");
    this.p2PlayerBoard = document.querySelector(".p2-player-board");

    this.initializeShips(this.p1OpponentShips);
    this.initializeShips(this.p2OpponentShips);
    this.initializeAllBoards();

    this.playerOneDisplay.style.display = "block";
    this.playerTwoDisplay.style.display = "none";
  }

  initializeShips(ships, draggable = false) {
    ships.innerHTML = "";
    for (const ship of this.shipDetails) {
      const myLi = makeElement({ label: "li", html: ship.name });
      if (draggable) {
        myLi.setAttribute("draggable", "true");
        myLi.setAttribute("data-index", ship.index);
      }
      ships.append(myLi);
    }
  }

  initializeAllBoards() {
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
  }

  initializeBoard(board, boardSelector, cellClasses) {
    board.innerHTML = "";

    // Add header row
    const myRowHeader = makeElement({ label: "div", classes: "row header" });
    myRowHeader.appendChild(makeElement({ label: "div", classes: "cell" }));
    for (let col = 0; col < this.size; col++) {
      myRowHeader.appendChild(
        makeElement({
          label: "div",
          classes: "cell header",
          html: (col + 1).toString(),
        }),
      );
    }
    board.appendChild(myRowHeader);

    // Add body rows
    for (let row = 0; row < this.size; row++) {
      const myRow = makeElement({ label: "div", classes: "row" });
      myRow.appendChild(
        makeElement({
          label: "div",
          classes: "cell header",
          html: String.fromCharCode(row + 65),
        }),
      );
      for (let col = 0; col < this.size; col++) {
        const myCell = makeElement({ label: "div", classes: cellClasses });
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

  updateDisplay() {
    this.clearBoard(this.p1OpponentBoard, "cell clickable");
    this.clearBoard(this.p2OpponentBoard, "cell clickable");
    this.clearBoard(this.p1PlayerBoard, "cell");
    this.clearBoard(this.p2PlayerBoard, "cell");

    this.updateOpponentBoard(this.p1, "p1-opponent-board");
    this.updateOpponentBoard(this.p2, "p2-opponent-board");
    this.updatePlayerBoard(this.p1, "p1-player-board");
    this.updatePlayerBoard(this.p2, "p2-player-board");
    this.updateShips();
  }

  clearBoard(board, cellClasses) {
    const cells = board.querySelectorAll(".cell");
    for (const cell of cells) {
      cell.className = cellClasses;
    }
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

  swapDisplay() {
    if (this.playerOneDisplay.style.display === "none") {
      this.playerTwoDisplay.style.display = "none";
      this.playerOneDisplay.style.display = "block";
    } else if (this.playerTwoDisplay.style.display === "none") {
      this.playerOneDisplay.style.display = "none";
      this.playerTwoDisplay.style.display = "block";
    } else {
      return false;
    }
  }
}
