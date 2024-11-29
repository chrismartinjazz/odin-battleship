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

    const targets = findTargets(shotsFired);

    // Phase 1: Create a list of all remaining coordinate options.
    const coordinatesRemaining = this.findRemainingCoordinates(coordinatesUsed);

    // Phase 2: Create a list of coordinates adjacent to a hit
    // TODO: adjust so only returns coordinates adjacent to isolated hits
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

    // Phase 3: Create a list of coordinates on the ends of 'lines' of hits,
    // where no hit in that line resulted in a sunk ship.
    /*
    Iterate over the hits.
    
    For each hit that is not sunk, look in all directions to find an adjacent hit.
    
    Once an adjacent hit is found, identify the full 'hitLine.
    - Add the two hits to a 'hitLine' array
    - Move to the second hit following the direction vector.
    - Look in the direction of the direction vector.
      - If it is a hit and sunk: continue to next hit.
      - If it is a hit and not sunk:
        - add it to the 'hitLine' array
        - remove it from the 'hitList' array
        - repeat the process.
      - If it is not
        - add it to the 'hitLineEnds' array
    - Look in the opposite direction of the direction vector.
      - If it is a hit
        - add it to the 'hitLine' array
        - remove it from the 'hitList' array
        - repeat the process.
        - If it is not
        - add it to the 'hitLineEnds' array
    Return the hitLine array and the hitLineEnds array

    Then, iterate over the hitLine array. If any of those coordinates are "sunk", 
    */

    const hitLineEndCoordinates = this.findHitLineEndCoordinates();
    for (const coordinate in hitCoordinates) {
      for (const direction in directionVectors) {
        if (coordinate.addVector(direction).isInList(hitCoordinates)) {
          const hitLine = this.findHitLine(coordinate, direction);
          hitLines.push(hitLine);
        }
      }
    }

    // find 'hits' that have an adjacent 'hit'.

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

  findRemainingCoordinates(coordinatesUsed) {
    const output = [];
    for (let row = 0; row < this.gameBoard.size; row++) {
      for (let col = 0; col < this.gameBoard.size; col++) {
        const coordinate = new Coordinate(row, col);
        if (!coordinate.isInList(coordinatesUsed)) {
          output.push(coordinate);
        }
      }
    }
    return output;
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

  findHitLineEndCoordinates(hits) {
    const hitCoordinates = hits.map((hit) => hit.coordinate);
    for (hit of hits) {
      if (hit.sunk) continue;
      for (direction of directionVectors) {
        hit.coordinate.addVector;
      }
    }
  }
}
