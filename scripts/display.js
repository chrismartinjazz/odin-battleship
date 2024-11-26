export class Display {
  constructor(size, shipDetails, p1, p2) {
    this.size = size;
    this.shipDetails = shipDetails;
    this.p1 = p1;
    this.p2 = p2;
    this.p1OpponentShips = document.querySelector(".p1-opponent-ships");
    this.p1OpponentBoard = document.querySelector(".p1-opponent-board");
    this.p1MoveList = document.querySelector(".p1-move-list");
    this.p1PlayerBoard = document.querySelector(".p1-player-board");
    this.p2OpponentShips = document.querySelector(".p2-opponent-ships");
    this.p2OpponentBoard = document.querySelector(".p2-opponent-board");
    this.p2MoveList = document.querySelector(".p2-move-list");
    this.p2PlayerBoard = document.querySelector(".p2-player-board");

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
    /*
    Render 'opponent board' showing:
      - Hit 🔴
      - Miss ⚪
    And allowing click to fire a shot.

    Steps
      - Initial board
      - Build grid of hit, miss, null for each coordinate
      - Render set of boxes with appropriate classes for hit/miss and for coordinate
    */

    /*
    Render 'board' showing:
    - Ship ❎
    - Hit 🔴
    */
  }

  initializeBoard(board, boardSelector, cellClasses) {
    board.innerHTML = "";

    // Add header row
    const myRowHeader = this.makeElement("div", "row header");
    myRowHeader.appendChild(this.makeElement("div", "cell"));
    for (let col = 0; col < this.size; col++) {
      myRowHeader.appendChild(
        this.makeElement("div", "cell header", String.fromCharCode(col + 65)),
      );
    }
    board.appendChild(myRowHeader);

    // Add body rows
    for (let row = 0; row < this.size; row++) {
      const myRow = this.makeElement("div", "row");
      myRow.appendChild(
        this.makeElement("div", "cell header", (row + 1).toString()),
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

  updateOpponentBoard(player, dataBoard) {
    // Add 'hit' or 'miss' class to cells that have been hit / missed
    for (const shot of player.gameBoard.shotsFired) {
      const cell = document.querySelector(
        `[data-board="${dataBoard}"][data-coordinate="${shot.coordinate.toString()}"]`,
      );
      cell.classList.add(shot.result);
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
  }

  makeElement(htmlTag = "div", cssClass, text) {
    const myElement = document.createElement(htmlTag);
    if (cssClass) myElement.className = cssClass;
    if (text) myElement.innerText = text;
    return myElement;
  }
}
