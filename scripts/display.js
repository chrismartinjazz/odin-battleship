export class Display {
  constructor(size, shipDetails, p1, p2) {
    this.size = size;
    this.shipDetails = shipDetails;
    this.p1 = p1;
    this.p2 = p2;
    this.p1OpponentShips = document.querySelector(".p1-opponent-ships");
    this.p1OpponentBoard = document.querySelector(".p1-opponent-board");
    this.p1MoveList = document.querySelector(".p1-move-list");
    this.p1Board = document.querySelector(".p1-board");
    this.p2OpponentShips = document.querySelector(".p2-opponent-ships");
    this.p2OpponentBoard = document.querySelector(".p2-opponent-board");
    this.p2MoveList = document.querySelector(".p2-move-list");
    this.p2Board = document.querySelector(".p2-board");

    this.initializeP1OpponentBoard();
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

  initializeP1OpponentBoard() {
    this.p1OpponentBoard.innerHTML = "";

    // Add header row
    const myRowHeader = this.makeElement("div", "row header");
    myRowHeader.appendChild(this.makeElement("div", "cell"));
    for (let col = 0; col < this.size; col++) {
      myRowHeader.appendChild(
        this.makeElement("div", "cell header", String.fromCharCode(col + 65)),
      );
    }
    this.p1OpponentBoard.appendChild(myRowHeader);

    // Add body rows
    for (let row = 0; row < this.size; row++) {
      const myRow = this.makeElement("div", "row");
      myRow.appendChild(
        this.makeElement("div", "cell header", (row + 1).toString()),
      );
      for (let col = 0; col < this.size; col++) {
        const myCell = this.makeElement("div", "cell clickable");
        myCell.setAttribute("data-row", row.toString());
        myCell.setAttribute("data-col", col.toString());
        myRow.appendChild(myCell);
      }
      this.p1OpponentBoard.appendChild(myRow);
    }

    // Add event listener - TODO make this send an attack and toggle current player
    this.p1OpponentBoard.addEventListener("click", (event) => {
      console.log(event.target.getAttribute("data-row"));
      console.log(event.target.getAttribute("data-col"));
    });
  }

  updateP1OpponentBoard() {
    // for (const hit in this.p1.gameBoard.hitsReceived) {
    //   const cell = document.querySelector(
    //     `.p1-opponent-board>.row>.cell[data-row="${hit.row}"][data-col="${hit.col}]`,
    //   );
    // }
  }

  makeElement(htmlTag = "div", cssClass, text) {
    const myElement = document.createElement(htmlTag);
    if (cssClass) myElement.className = cssClass;
    if (text) myElement.innerText = text;
    return myElement;
  }
}
