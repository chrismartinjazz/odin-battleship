export class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
  }

  hit() {
    if (!this.isSunk()) {
      this.hits += 1;
    }
  }

  isSunk() {
    return this.hits >= this.length;
  }
  /*
  length (4), hits (0), sunk (false)

  hit() - increase number of hits in ship
  isSunk() - true if considered sunk
  */
}
