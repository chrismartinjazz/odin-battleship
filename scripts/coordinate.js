export class Coordinate {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  isEqual(otherCoordinate) {
    return this.row === otherCoordinate.row && this.col === otherCoordinate.col;
  }

  isInRange(rowMin, rowMax, colMin, colMax) {
    return (
      rowMin <= this.row &&
      this.row <= rowMax &&
      colMin <= this.col &&
      this.col <= colMax
    );
  }

  isInList(list) {
    return list.some((coordinate) => coordinate.isEqual(this));
  }

  addVector(vector) {
    return new Coordinate(this.row + vector.row, this.col + vector.col);
  }

  toString() {
    return `${this.row},${this.col}`;
  }
}

export function validateCoordinates(originalList, validateList, size) {
  for (const coordinateToValidate of validateList) {
    if (coordinateToValidate.isInList(originalList)) {
      return false;
    }
    if (!coordinateToValidate.isInRange(0, size, 0, size)) {
      return false;
    }
  }
  return true;
}

export function generateCoordinateLine(
  startCoordinate,
  directionVector,
  length,
) {
  let output = [startCoordinate];
  for (let i = 0; i < length - 1; i++) {
    const prevCoord = output.at(-1);
    output.push(prevCoord.addVector(directionVector));
  }
  return output;
}

export function coordinateFromString(string) {
  const rowCol = string.split(",").map((item) => Number(item));
  return new Coordinate(rowCol[0], rowCol[1]);
}
