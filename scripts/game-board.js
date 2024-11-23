import { Ship } from "./ship";
import { calculateShipCoordinates } from "./calculate-ship-coordinates";

export class GameBoard {
  constructor(size) {
    this.size = size;
    this.ships = [];
    this.shipCoordinates = [];
    this.hitsReceived = [];
    this.shotsFired = [];
  }

  placeShip(startingCoordinate, directionVector, length) {
    const coordinates = calculateShipCoordinates(
      startingCoordinate,
      directionVector,
      length,
    );
    if (this.validateCoordinates(coordinates)) {
      this.addCoordinates(coordinates);
      const ship = new Ship(length);
      this.ships.push([ship, coordinates]);
      return true;
    } else {
      return false;
    }
  }

  validateCoordinates(coordinates) {
    let checkString = "";
    for (const coordinate of this.shipCoordinates) {
      checkString += `|${coordinate.toString()}`;
    }

    for (let i = 0; i < coordinates.length; i++) {
      if (checkString.includes(coordinates[i].toString())) return false;
      if (
        coordinates[i][0] < 0 ||
        coordinates[i][1] < 0 ||
        coordinates[i][0] > this.size ||
        coordinates[i][1] > this.size
      )
        return false;
    }
    return true;
  }

  addCoordinates(coordinates) {
    for (const coordinate of coordinates) {
      this.shipCoordinates.push(coordinate);
    }
  }

  receiveAttack() {}
}
