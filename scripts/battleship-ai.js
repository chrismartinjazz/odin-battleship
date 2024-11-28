import { Coordinate, directionVectors } from "./coordinate.js";

export class BattleshipAi {
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
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

    const adjacentCoordinates = [];
    const hits = this.gameBoard.shotsFired.filter(
      (shot) => shot.result === "hit",
    );
    for (const hit of hits) {
      const coordinates = this.findAdjacentCoordinates(
        hit.coordinate,
        coordinatesRemaining,
      );

      for (const coordinate of coordinates) {
        if (!coordinate.isInList(adjacentCoordinates)) {
          adjacentCoordinates.push(coordinate);
        }
      }
    }

    // Select a random element from remaining options.
    if (adjacentCoordinates.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * adjacentCoordinates.length,
      );
      return adjacentCoordinates[randomIndex];
    }
    const randomIndex = Math.floor(Math.random() * coordinatesRemaining.length);
    return coordinatesRemaining[randomIndex];
  }

  findAdjacentCoordinates(coordinate, coordinatesRemaining) {
    // Iterate over the four direction vectors, getting a new coordinate from each.
    // Return an array of coordinates that are valid: i.e. in coordinatesRemaining, and not off the board.
    const output = [];
    for (const direction of directionVectors) {
      const adjacentCoordinate = coordinate.addVector(direction);
      if (adjacentCoordinate.isInList(coordinatesRemaining)) {
        output.push(adjacentCoordinate);
      }
    }
    return output;
  }
}
