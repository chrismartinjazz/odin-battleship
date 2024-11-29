import {
  Coordinate,
  directionVectors,
  validateCoordinates,
} from "./coordinate.js";

// A 'shot' is an object consisting of a coordinate, a result, and a sunk value (null or a number).
// Fired at A1, hit, not sunk: {coordinate: {row: 0, col: 0}, result: "hit", sunk: null}

// A 'coordinate' is a coordinate object with {row: m, col: n}.
// A 'hit' is a coordinate (derived from a shot that 'hit'), an array of them is 'hits'
// A 'miss' is a coordinate (derived from a shot that 'missed'), an array of them is 'misses'

export class BattleshipAi {
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
  }

  chooseCoordinate() {
    // Get list of coordinates already fired at.
    const coordinatesUsed = this.gameBoard.coordinateList(
      this.gameBoard.shotsFired,
    );

    // Priority 1 targets: Find coordinates at the ends of lines of hits, where
    // none in the line are "sunk", and the coordinate is not already fired at.
    // Return one at random if any are found.
    const priorityOneTargets = this.findPriorityOneTargets(
      this.gameBoard.shotsFired,
      coordinatesUsed,
    );
    if (priorityOneTargets.length > 0)
      return this.chooseRandomTarget(priorityOneTargets);

    // Priority 2 targets: Create a list of coordinates adjacent to isolated hits,
    // where the coordinate is not already fired at.
    // Return one at random if any are found.
    let priorityTwoTargets = this.findPriorityTwoTargets(
      this.gameBoard.shotsFired,
      coordinatesUsed,
    );
    if (priorityTwoTargets.length > 0)
      return this.chooseRandomTarget(priorityTwoTargets);

    // Phase 3: There are no priority targets, so choose a target at random from remaining options.
    const coordinatesRemaining = this.findRemainingCoordinates(coordinatesUsed);
    if (coordinatesRemaining.length > 0)
      return this.chooseSortedRandomTarget(coordinatesRemaining);

    return "Error: no coordinates available";
  }

  findPriorityOneTargets(shotsFired, coordinatesUsed = []) {
    // Returns an array of coordinates.
    const output = this.findEndOfLineCoordinates(shotsFired);

    return output.filter((target) => !target.isInList(coordinatesUsed));
  }

  findEndOfLineCoordinates(shotsFired) {
    const output = [];

    const hitCoordinates = shotsFired
      .filter((shot) => shot.result === "hit")
      .map((shot) => shot.coordinate);

    const sunkCoordinates = shotsFired
      .filter((shot) => shot.sunk !== null)
      .map((shot) => shot.coordinate);

    for (const hit of hitCoordinates) {
      for (const direction of directionVectors) {
        if (hit.addVector(direction).isInList(hitCoordinates)) {
          const endOfLineForwards = this.findEndOfLineCoordinate(
            hit,
            direction,
            hitCoordinates,
            sunkCoordinates,
          );
          if (endOfLineForwards === "sunk") continue;

          const endOfLineBackwards = this.findEndOfLineCoordinate(
            hit,
            direction.reverse,
            hitCoordinates,
            sunkCoordinates,
          );
          if (endOfLineBackwards === "sunk") continue;

          if (endOfLineForwards && !endOfLineForwards.isInList(output))
            output.push(endOfLineForwards);
          if (endOfLineBackwards && !endOfLineBackwards.isInList(output))
            output.push(endOfLineBackwards);
        }
      }
    }

    return output;
  }

  findEndOfLineCoordinate(
    hit,
    directionVector,
    hitCoordinates = [],
    sunkCoordinates = [],
  ) {
    // Expects a coordinate, returns either "sunk" if finds ship is sunk,
    // the coordinate, or 'false' if off the board.
    let nextCoordinate = hit;
    let shipIsSunk = false;

    let keepGoing = true;
    while (keepGoing) {
      // If the coordinate is sunk, note this and exit the loop.
      if (nextCoordinate.isInList(sunkCoordinates)) {
        shipIsSunk = true;
        keepGoing = false;
      }
      // If the next coordinate on the line is not a hit, exit the loop.
      nextCoordinate = nextCoordinate.addVector(directionVector);
      if (!nextCoordinate.isInList(hitCoordinates)) {
        keepGoing = false;
      }
    }
    if (shipIsSunk) return "sunk";
    if (validateCoordinates([], [nextCoordinate], this.gameBoard.size))
      return nextCoordinate;
    return false;
  }

  findPriorityTwoTargets(shotsFired, coordinatesUsed = []) {
    // Returns an array of coordinates.
    const output = [];

    const isolatedHits = this.findIsolatedHits(shotsFired);

    for (const hit of isolatedHits) {
      const adjacentCoordinates = this.findAdjacentCoordinates(hit);
      for (const coordinate of adjacentCoordinates) {
        if (!coordinate.isInList(output)) {
          output.push(coordinate);
        }
      }
    }
    return output.filter((target) => !target.isInList(coordinatesUsed));
  }

  findIsolatedHits(shotsFired = []) {
    // A hit is isolated if it has no adjacent hits.
    // Expects an array of shots. Returns an array of coordinates.

    const isolatedHits = [];

    const hitCoordinates = shotsFired
      .filter((shot) => shot.result === "hit")
      .map((shot) => shot.coordinate);

    for (const hit of hitCoordinates) {
      let hitIsIsolated = true;
      for (const direction of directionVectors) {
        if (hit.addVector(direction).isInList(hitCoordinates)) {
          hitIsIsolated = false;
        }
      }
      if (hitIsIsolated) isolatedHits.push(hit);
    }

    return isolatedHits;
  }

  findRemainingCoordinates(coordinatesUsed) {
    // Given an array of coordinates and a board size, return a list of all
    // coordinates that are on the board, but not on the list.
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

  findAdjacentCoordinates(coordinate) {
    // Iterate over the four direction vectors, getting a new coordinate from each.
    // Return an array of coordinates that are not off the board, in order right, down, left, up.
    const output = [];
    for (const direction of directionVectors) {
      const adjacentCoordinate = coordinate.addVector(direction);
      if (
        validateCoordinates([], [adjacentCoordinate], this.gameBoard.size) &&
        !adjacentCoordinate.isInList(output)
      ) {
        output.push(adjacentCoordinate);
      }
    }
    return output;
  }

  chooseRandomTarget(targets) {
    const randomIndex = Math.floor(Math.random() * targets.length);
    return targets[randomIndex];
  }

  chooseSortedRandomTarget(targets) {
    const sortedTargets = [[], [], [], [], []];

    for (const target of targets) {
      let freeAdjacentCoordinates = 0;
      const adjacentCoordinates = this.findAdjacentCoordinates(target);
      for (const coordinate of adjacentCoordinates) {
        if (coordinate.isInList(targets)) {
          freeAdjacentCoordinates += 1;
        }
      }
      sortedTargets[freeAdjacentCoordinates].push(target);
    }

    for (let i = sortedTargets.length - 1; i >= 0; i--) {
      if (sortedTargets[i].length === 0) continue;
      return this.chooseRandomTarget(sortedTargets[i]);
    }

    return "Error: target not selected";
  }
}
