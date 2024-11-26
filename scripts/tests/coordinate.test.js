import { it, expect, describe } from "@jest/globals";
import {
  Coordinate,
  validateCoordinates,
  generateCoordinateLine,
} from "../coordinate";

describe("Coordinate class", () => {
  it("creates an object when called with x and y values", () => {
    const myCoordinate = new Coordinate(0, 1);
    expect(typeof myCoordinate).toBe("object");
  });

  it("tests if two coordinates are equal", () => {
    const coordinate1 = new Coordinate(0, 1);
    const coordinate2 = new Coordinate(0, 1);
    const coordinate3 = new Coordinate(0, 0);

    expect(coordinate1.isEqual(coordinate2)).toBe(true);
    expect(coordinate1.isEqual(coordinate3)).toBe(false);
  });

  it("tests is a coordinate is in a range", () => {
    const coordinate = new Coordinate(3, 4);
    expect(coordinate.isInRange(0, 10, 0, 10)).toBe(true);
    expect(coordinate.isInRange(0, 3, 0, 3)).toBe(false);
  });

  it("adds a vector to a coordinate and returns a new coordinate", () => {
    const coordinate = new Coordinate(1, 2);
    const vector = new Coordinate(3, 5);
    const expectedResult = new Coordinate(4, 7);
    expect(coordinate.addVector(vector).isEqual(expectedResult));
  });

  it("returns e.g.'1,2' as string", () => {
    const coordinate = new Coordinate(1, 2);
    expect(coordinate.toString()).toEqual("1,2");
  });
});

describe("validateCoordinates", () => {
  const originalList = [new Coordinate(0, 0), new Coordinate(0, 1)];
  let validateList = [new Coordinate(0, 0), new Coordinate(1, 0)];

  it("returns false if a coordinate is in the original list", () => {
    expect(validateCoordinates(originalList, validateList, 10)).toBe(false);
  });

  it("returns true if no coordinates are in the original list", () => {
    validateList = [new Coordinate(0, 2), new Coordinate(0, 3)];
    expect(validateCoordinates(originalList, validateList, 10)).toBe(true);
  });

  it("returns false if any coordinate in validation list is outside size range", () => {
    validateList = [new Coordinate(0, 2), new Coordinate(11, 0)];
    expect(validateCoordinates(originalList, validateList, 10)).toBe(false);
  });
});

describe("generateCoordinateLine", () => {
  let startCoordinate = new Coordinate(0, 0);
  let directionVector = new Coordinate(0, 1);

  it("returns coordinates [0, 0], [0, 1] when called with [0, 0], [0, 1], 2}", () => {
    const expectedResult = [new Coordinate(0, 0), new Coordinate(0, 1)];
    expect(generateCoordinateLine(startCoordinate, directionVector, 2)).toEqual(
      expectedResult,
    );
  });

  it("returns coordinates [0, 0], [1, 0], [2, 0] when called with [0, 0], [1, 0], 3}", () => {
    directionVector = new Coordinate(1, 0);
    const expectedResult = [
      new Coordinate(0, 0),
      new Coordinate(1, 0),
      new Coordinate(2, 0),
    ];
    expect(generateCoordinateLine(startCoordinate, directionVector, 3)).toEqual(
      expectedResult,
    );
  });
});
