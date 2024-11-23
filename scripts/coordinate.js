export class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  isEqual(otherCoordinate) {
    return this.x === otherCoordinate.x && this.y === otherCoordinate.y;
  }

  isInRange(xMin, xMax, yMin, yMax) {
    return xMin <= this.x && this.x <= xMax && yMin <= this.y && this.y <= yMax;
  }

  isInList(list) {
    return list.some((coordinate) => coordinate.isEqual(this));
  }

  addVector(vector) {
    return new Coordinate(this.x + vector.x, this.y + vector.y);
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
