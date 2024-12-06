import { Coordinate, directionVectors } from "./coordinate.js";
import { GameBoard } from "./game-board.js";
import { BattleshipAi } from "./battleship-ai.js";

export class Player {
  // Type can be "human" or "computer".
  // Id must be either "p1" or "p2".
  constructor(size, id, type = "human") {
    this.gameBoard = new GameBoard(size);
    this.id = id;
    this.type = type;
    this.battleshipAi = new BattleshipAi(this.gameBoard);
  }

  toString() {
    return this.id;
  }

  chooseCoordinate() {
    return this.battleshipAi.chooseCoordinate();
  }

  placeShipsRandom(shipDetails) {
    this.gameBoard.removeAllShips();

    // Iterate over the ships
    for (let i = 0; i < shipDetails.length; i++) {
      let keepGoing = true;
      let loopCount = 0;
      // Keep going until a valid ship placement is found.
      while (keepGoing && loopCount < 1000) {
        // Randomly place the ship on the board.
        const row = Math.floor(Math.random() * this.gameBoard.size);
        const col = Math.floor(Math.random() * this.gameBoard.size);
        const direction = directionVectors[Math.floor(Math.random() * 4)];
        const coordinate = new Coordinate(row, col);
        // Attempt to place the ship on the board. If it is successful, the ship
        // is now on the board. If not, returns false.
        const result = this.gameBoard.placeShip(
          shipDetails[i].index,
          coordinate,
          direction,
          shipDetails[i].length,
        );
        // End loop if the ship was placed successfully.
        if (result) keepGoing = false;

        loopCount += 1;
      }
      console.log(loopCount);
    }
  }
}
