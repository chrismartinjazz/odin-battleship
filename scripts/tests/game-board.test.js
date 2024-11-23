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
    myGameBoard.placeShip(new Coordinate(0, 0), new Coordinate(0, 1), 2);
    expect(myGameBoard.shipCoordinates).toEqual(expectedResult);
    console.log(myGameBoard.ships);
  });

  it("returns false if attempt to place a ship on same square", () => {
    expect(
      myGameBoard.placeShip(new Coordinate(0, 0), new Coordinate(1, 0), 2),
    ).toBe(false);
    expect(myGameBoard.shipCoordinates).toEqual(expectedResult);
  });

  it("returns false if attempt to place a ship off the board", () => {
    expect(
      myGameBoard.placeShip(new Coordinate(0, 0), new Coordinate(0, -1), 2),
    ).toBe(false);
    expect(myGameBoard.shipCoordinates).toEqual(expectedResult);
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
      new Coordinate(10, 9),
      new Coordinate(10, 10),
    ];
    myGameBoard.placeShip(new Coordinate(0, 0), new Coordinate(0, 1), 5);
    myGameBoard.placeShip(new Coordinate(2, 3), new Coordinate(1, 0), 4);
    myGameBoard.placeShip(new Coordinate(8, 4), new Coordinate(0, 1), 3);
    myGameBoard.placeShip(new Coordinate(3, 8), new Coordinate(1, 0), 3);
    myGameBoard.placeShip(new Coordinate(10, 9), new Coordinate(0, 1), 2);
    expect(myGameBoard.ships.length).toBe(5);
    expect(myGameBoard.shipCoordinates).toEqual(expectedResult);
  });
});

describe("receiveAttack", () => {
  const myGameBoard = new GameBoard(10);
  myGameBoard.placeShip(new Coordinate(0, 0), new Coordinate(0, 1), 2);
  // myGameBoard has 1 ship at (0, 0) and at (0, 1)

  it("returns 'hit' if the attack hit a ship", () => {
    expect(myGameBoard.receiveAttack(new Coordinate(0, 0))).toBe("hit");
  });

  it.skip("returns 'miss' if the attack hit no ships", () => {
    expect(myGameBoard.receiveAttack(new Coordinate(0, 2))).toBe("miss");
  });

  it.todo("adds the coordinates to this.hitsReceived ");
  it.todo(
    "doesn't add the coordinates to this.hitsReceived if they are already on that list",
  );
  it.todo("");
});
