import { Ship } from "./ship.js";
import { generateCoordinateLine, validateCoordinates } from "./coordinate.js";

export class GameBoard {
  constructor(size) {
    this.size = size;
    this.ships = [];
    this.shotsFired = [];
    this.shotsReceived = [];
  }

  removeAllShips() {
    this.ships = [];
  }

  placeShip(index, startingCoordinate, directionVector, length) {
    const newShipCoordinates = generateCoordinateLine(
      startingCoordinate,
      directionVector,
      length,
    );

    const currentShipCoordinates = this.getCurrentShipCoordinates();

    if (
      validateCoordinates(
        currentShipCoordinates,
        newShipCoordinates,
        this.size,
      ) &&
      !this.shipIsPlaced(index)
    ) {
      const ship = new Ship(length);
      this.ships.push({
        index: index,
        ship: ship,
        coordinates: newShipCoordinates,
      });
      return true;
    } else {
      return false;
    }
  }

  shipIsPlaced(index) {
    return this.ships.some((shipRecord) => shipRecord.index === index);
  }

  getCurrentShipCoordinates() {
    let result = [];
    for (const ship of this.ships) {
      result = result.concat(ship.coordinates);
    }
    return result;
  }

  updateBoardState(coordinates) {
    for (const coordinate of coordinates) {
      this.shotsReceived.push(coordinate);
    }
  }

  updateShotsFired({ coordinate, result, sunk }) {
    this.shotsFired.push({ coordinate, result, sunk });
  }

  updateShotsReceived({ coordinate, result }) {
    this.shotsReceived.push({ coordinate, result });
  }

  receiveAttack(coordinate) {
    /* 
    Check if a coordinate is valid (has not already been recorded, not off the
    board). Return undefined if invalid. 'Hit' a ship if appropriate and return
    a record of results.
    */
    let coordinatesShot = this.coordinateList(this.shotsReceived);

    if (validateCoordinates(coordinatesShot, [coordinate], this.size)) {
      const shipAndIndex = this.findShipAndIndex(coordinate);
      if (shipAndIndex) {
        shipAndIndex.ship.hit();
        this.shotsReceived.push({ coordinate, result: "hit" });
        const sunk = shipAndIndex.ship.isSunk() ? shipAndIndex.index : null;
        return { coordinate, result: "hit", sunk };
      }
      this.shotsReceived.push({ coordinate, result: "miss" });
      return { coordinate, result: "miss", sunk: null };
    }
    return false;
  }

  coordinateList(shotList) {
    return shotList.map((shot) => shot.coordinate);
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
