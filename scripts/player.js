import { Coordinate } from "./coordinate.js";
import { GameBoard } from "./game-board.js";

export class Player {
  constructor(size, string, type = "human") {
    this.gameBoard = new GameBoard(size);
    this.string = string;
    this.type = type;
  }

  toString() {
    return this.string;
  }

  chooseCoordinate() {
    // Get list of coordinates already fired.
    const coordinatesUsed = this.gameBoard.coordinateList(
      this.gameBoard.shotsFired,
    );

    // Create a list of remaining coordinate options.
    const coordinatesRemaining = [];
    for (let row = 0; row < this.gameBoard.size; row++) {
      for (let col = 0; col < this.gameBoard.size; col++) {
        const coordinate = new Coordinate(row, col);
        if (!coordinate.isInList(coordinatesUsed)) {
          coordinatesRemaining.push(coordinate);
        }
      }
    }
    // Select a random element from remaining options.
    const randomIndex = Math.floor(Math.random() * coordinatesRemaining.length);
    // return coordinatesRemaining;
    return coordinatesRemaining[randomIndex];
  }
}
