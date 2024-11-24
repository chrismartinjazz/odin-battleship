import { Ship } from "./ship";
import { generateCoordinateLine, validateCoordinates } from "./coordinate";

export class GameBoard {
  constructor(size) {
    this.size = size;
    this.ships = [];
    this.shipCoordinates = [];
    this.hitsReceived = [];
    this.missesReceived = [];
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
      this.ships.push({ ship: ship, coordinates: newCoordinates });
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
    const ship = this.findShip(coordinate);
    if (ship && !coordinate.isInList(this.hitsReceived)) {
      ship.hit();
      this.hitsReceived.push(coordinate);
      return "hit";
    }
    if (!coordinate.isInList(this.missesReceived)) {
      this.missesReceived.push(coordinate);
    }
    return "miss";
  }

  findShip(coordinate) {
    for (let i = 0; i < this.ships.length; i++) {
      if (coordinate.isInList(this.ships[i].coordinates)) {
        return this.ships[i].ship;
      }
    }
    return false;
  }

  shipsSunk() {
    return this.ships.filter((shipRecord) => shipRecord.ship.isSunk()).length;
  }

  allShipsSunk() {
    return this.shipsSunk() === this.ships.length;
  }
}
