import { Ship } from "./ship";
import { generateCoordinateLine, validateCoordinates } from "./coordinate";

export class GameBoard {
  constructor(size) {
    this.size = size;
    this.ships = [];
    this.shipCoordinates = [];
    this.hitsReceived = [];
    this.shotsFired = [];
  }

  placeShip(startingCoordinate, directionVector, length) {
    const newCoordinates = generateCoordinateLine(
      startingCoordinate,
      directionVector,
      length,
    );
    if (validateCoordinates(this.shipCoordinates, newCoordinates, this.size)) {
      this.addCoordinates(newCoordinates);
      const ship = new Ship(length);
      this.ships.push([ship, newCoordinates]);
      return true;
    } else {
      return false;
    }
  }

  addCoordinates(coordinates) {
    for (const coordinate of coordinates) {
      this.shipCoordinates.push(coordinate);
    }
  }

  receiveAttack(coordinate) {
    // If the coordinate matches any ship's coordinates,
    return "hit";
  }
}
