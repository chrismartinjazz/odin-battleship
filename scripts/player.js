import { Coordinate, directionVectors } from "./coordinate.js";
import { GameBoard } from "./game-board.js";
import { BattleshipAi } from "./battleship-ai.js";

export class Player {
  constructor(size, string, type = "human") {
    this.gameBoard = new GameBoard(size);
    this.string = string;
    this.type = type;
    this.battleshipAi = new BattleshipAi(this.gameBoard);
  }

  toString() {
    return this.string;
  }

  chooseCoordinate() {
    return this.battleshipAi.chooseCoordinate();
  }

  placeShipsRandom(shipDetails) {
    for (let i = 0; i < shipDetails.length; i++) {
      let keepGoing = true;
      while (keepGoing) {
        const row = Math.floor(Math.random() * this.gameBoard.size);
        const col = Math.floor(Math.random() * this.gameBoard.size);
        const direction = directionVectors[Math.floor(Math.random() * 4)];
        const coordinate = new Coordinate(row, col);
        const result = this.gameBoard.placeShip(
          coordinate,
          direction,
          shipDetails[i].length,
        );
        if (result) keepGoing = false;
      }
    }
  }
}
