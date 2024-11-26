import { Ship } from "./ship.js";
import { generateCoordinateLine, validateCoordinates } from "./coordinate.js";

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

  updateShotsFired({ coordinate, result }) {
    this.shotsFired.push({ coordinate, result });
  }

  receiveAttack(coordinate) {
    /* 
    Check if a coordinate is valid (has not already been recorded, not off the
    board). Return undefined if invalid. 'Hit' a ship if appropriate and return
    a record of results.
    */
    if (
      validateCoordinates(
        this.hitsReceived.concat(this.missesReceived),
        [coordinate],
        this.size,
      )
    ) {
      const shipAndIndex = this.findShipAndIndex(coordinate);
      if (shipAndIndex) {
        shipAndIndex.ship.hit();
        this.hitsReceived.push(coordinate);
        const sunk = shipAndIndex.ship.isSunk() ? shipAndIndex.index : null;
        return { coordinate, result: "hit", sunk };
      }
      this.missesReceived.push(coordinate);
      return { coordinate, result: "miss", sunk: null };
    }
    return;
  }

  findShipAndIndex(coordinate) {
    for (let i = 0; i < this.ships.length; i++) {
      if (coordinate.isInList(this.ships[i].coordinates)) {
        return { ship: this.ships[i].ship, index: i };
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
