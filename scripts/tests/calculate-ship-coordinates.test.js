import { it, expect } from "@jest/globals";
import { calculateShipCoordinates } from "../calculate-ship-coordinates.js";

it("returns undefined when called with no arguments", () => {
  expect(calculateShipCoordinates()).toBe(undefined);
});

it("returns [[0, 0], [0, 1]] when called with [0, 0], [0, 1], 2}", () => {
  expect(calculateShipCoordinates([0, 0], [0, 1], 2)).toEqual([
    [0, 0],
    [0, 1],
  ]);
});

it("returns [[0, 0], [0, 1]] when called with [0, 0], [0, 1], 3}", () => {
  expect(calculateShipCoordinates([0, 0], [0, 1], 2)).toEqual([
    [0, 0],
    [0, 1],
  ]);
});

it("calculates a variety of ships correctly starting at the top left coordinate", () => {
  expect(calculateShipCoordinates([0, 0], [1, 0], 5)).toEqual([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
  ]);
});
