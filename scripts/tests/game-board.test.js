import { describe, it, expect } from "@jest/globals";
import { GameBoard } from "../game-board";
import { Coordinate } from "../coordinate";

it("creates an object", () => {
  const myGameBoard = new GameBoard(10);
  expect(typeof myGameBoard === "object");
});

describe("placeShip", () => {
  let myGameBoard = new GameBoard(10);
  let expectedResult = [new Coordinate(0, 0), new Coordinate(0, 1)];

  it("can place a ship in the top corner", () => {
    myGameBoard.placeShip(4, new Coordinate(0, 0), new Coordinate(0, 1), 2);
    expect(myGameBoard.getCurrentShipCoordinates()).toEqual(expectedResult);
  });

  it("returns false if attempt to place a ship on same square", () => {
    expect(
      myGameBoard.placeShip(4, new Coordinate(0, 0), new Coordinate(1, 0), 2),
    ).toBe(false);
    expect(myGameBoard.getCurrentShipCoordinates()).toEqual(expectedResult);
  });

  it("returns false if attempt to place a ship off the board", () => {
    expect(
      myGameBoard.placeShip(4, new Coordinate(0, 0), new Coordinate(0, -1), 2),
    ).toBe(false);
    expect(myGameBoard.getCurrentShipCoordinates()).toEqual(expectedResult);
  });

  it("can place all ships on the board, creating the ships and recording their positions", () => {
    myGameBoard = new GameBoard(10);
    expectedResult = [
      new Coordinate(0, 0),
      new Coordinate(0, 1),
      new Coordinate(0, 2),
      new Coordinate(0, 3),
      new Coordinate(0, 4),
      new Coordinate(2, 3),
      new Coordinate(3, 3),
      new Coordinate(4, 3),
      new Coordinate(5, 3),
      new Coordinate(8, 4),
      new Coordinate(8, 5),
      new Coordinate(8, 6),
      new Coordinate(3, 8),
      new Coordinate(4, 8),
      new Coordinate(5, 8),
      new Coordinate(8, 8),
      new Coordinate(8, 9),
    ];
    myGameBoard.placeShip(0, new Coordinate(0, 0), new Coordinate(0, 1), 5);
    myGameBoard.placeShip(1, new Coordinate(2, 3), new Coordinate(1, 0), 4);
    myGameBoard.placeShip(2, new Coordinate(8, 4), new Coordinate(0, 1), 3);
    myGameBoard.placeShip(3, new Coordinate(3, 8), new Coordinate(1, 0), 3);
    myGameBoard.placeShip(4, new Coordinate(8, 8), new Coordinate(0, 1), 2);
    expect(myGameBoard.ships.length).toBe(5);
    expect(myGameBoard.getCurrentShipCoordinates()).toEqual(expectedResult);
  });
});

describe("findShipAndIndex", () => {
  const myGameBoard = new GameBoard(10);
  myGameBoard.placeShip(4, new Coordinate(0, 0), new Coordinate(0, 1), 2);
  it("returns a ship when called with a valid coordinate", () => {
    expect(typeof myGameBoard.findShipAndIndex(new Coordinate(0, 0))).toBe(
      "object",
    );
  });
});

describe("coordinateList", () => {
  const myGameBoard = new GameBoard(10);
  it("returns a list of coordinates when given a list of objects", () => {
    const input = [
      { coordinate: new Coordinate(0, 0), result: "hit" },
      { coordinate: new Coordinate(0, 1), result: "miss" },
    ];
    const expectedResult = [new Coordinate(0, 0), new Coordinate(0, 1)];
    expect(myGameBoard.coordinateList(input)).toEqual(expectedResult);
  });
});

describe("receiveAttack", () => {
  const myGameBoard = new GameBoard(10);
  myGameBoard.placeShip(4, new Coordinate(0, 0), new Coordinate(0, 1), 2);
  // myGameBoard has 1 ship at (0, 0) and at (0, 1)

  it("returns result = 'hit' if the attack hit a ship", () => {
    expect(myGameBoard.receiveAttack(new Coordinate(0, 0)).result).toBe("hit");
  });

  it("adds the coordinates to GameBoard's shotsReceived", () => {
    expect(myGameBoard.shotsReceived[0].coordinate).toEqual(
      new Coordinate(0, 0),
    );
    expect(myGameBoard.shotsReceived[0].result).toEqual("hit");
  });

  it("returns result = 'miss' if the attack hit no ships", () => {
    expect(myGameBoard.receiveAttack(new Coordinate(0, 2)).result).toBe("miss");
  });

  it("returns false if attacking a square that has already been 'hit' and doesn't change receivedShots", () => {
    let initialShotsReceived = myGameBoard.shotsReceived;
    expect(myGameBoard.receiveAttack(new Coordinate(0, 0))).toBe(false);
    expect(myGameBoard.shotsReceived).toEqual(initialShotsReceived);
  });

  it("sends a message to the correct ship when there is only one ship", () => {
    expect(myGameBoard.ships[0].ship.hits).toBe(1);
  });

  myGameBoard.placeShip(3, new Coordinate(1, 0), new Coordinate(0, 1), 3);

  it("sends a message to the correct ship when there is more that one ship", () => {
    myGameBoard.receiveAttack(new Coordinate(1, 1));
    expect(myGameBoard.ships[1].ship.hits).toBe(1);
  });
});

describe("shipsSunk", () => {
  const myGameBoard = new GameBoard(10);
  myGameBoard.placeShip(4, new Coordinate(0, 0), new Coordinate(0, 1), 2);

  it("is 0 when no ships are sunk", () => {
    expect(myGameBoard.shipsSunk()).toBe(0);
  });

  it("is not affected by a hit on a ship, that did not sink a ship", () => {
    myGameBoard.receiveAttack(new Coordinate(0, 0));
    expect(myGameBoard.shipsSunk()).toBe(0);
  });

  it("is 1 if 1 ship has been sunk", () => {
    myGameBoard.receiveAttack(new Coordinate(0, 1));
    expect(myGameBoard.shipsSunk()).toBe(1);
  });

  it("is still 1 if an already sunk ship is attacked", () => {
    myGameBoard.receiveAttack(new Coordinate(0, 1));
    expect(myGameBoard.shipsSunk()).toBe(1);
  });
});

describe("allShipsSunk", () => {
  const myGameBoard = new GameBoard(10);
  myGameBoard.placeShip(4, new Coordinate(0, 0), new Coordinate(0, 1), 2);

  it("is false initially", () => {
    expect(myGameBoard.allShipsSunk()).toBe(false);
  });

  it("is unchanged if a ship is hit, but not sunk", () => {
    myGameBoard.receiveAttack(new Coordinate(0, 0));
    expect(myGameBoard.allShipsSunk()).toBe(false);
  });

  it("is true if all ships have been sunk", () => {
    myGameBoard.receiveAttack(new Coordinate(0, 1));
    expect(myGameBoard.allShipsSunk()).toBe(true);
  });
});
