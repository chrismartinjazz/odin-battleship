import { describe, it, expect } from "@jest/globals";
import { GameBoard } from "../game-board";

it("creates an object", () => {
  const myGameBoard = new GameBoard(10);
  expect(typeof myGameBoard === "object");
});

describe("placeShip", () => {
  it("can place a ship in the top corner", () => {
    const myGameBoard = new GameBoard(10);
    myGameBoard.placeShip([0, 0], [0, 1], 2);
    expect(myGameBoard.shipCoordinates).toEqual([
      [0, 0],
      [0, 1],
    ]);
    console.log(myGameBoard.ships);
  });

  it("returns false if attempt to place a ship on same square", () => {
    const myGameBoard = new GameBoard(10);
    expect(myGameBoard.placeShip([0, 0], [0, 1], 2)).toBe(true);
    expect(myGameBoard.placeShip([0, 0], [1, 0], 2)).toBe(false);
    expect(myGameBoard.shipCoordinates).toEqual([
      [0, 0],
      [0, 1],
    ]);
  });

  it("returns false if attempt to place a ship off the board", () => {
    const myGameBoard = new GameBoard(10);
    expect(myGameBoard.placeShip([0, 0], [0, -1], 2)).toBe(false);
    expect(myGameBoard.placeShip([0, 0], [0, -1], 2)).toBe(false);
    expect(myGameBoard.shipCoordinates).toEqual([]);
  });

  it("can place all ships on the board, creating the ships and recording their positions", () => {
    const myGameBoard = new GameBoard(10);
    myGameBoard.placeShip([0, 0], [0, 1], 5);
    myGameBoard.placeShip([2, 3], [1, 0], 4);
    myGameBoard.placeShip([8, 4], [0, 1], 3);
    myGameBoard.placeShip([3, 8], [1, 0], 3);
    myGameBoard.placeShip([10, 9], [0, 1], 2);
    expect(myGameBoard.shipCoordinates).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
      [8, 4],
      [8, 5],
      [8, 6],
      [3, 8],
      [4, 8],
      [5, 8],
      [10, 9],
      [10, 10],
    ]);
    expect(myGameBoard.ships.length).toBe(5);
  });
});
