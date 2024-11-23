import { it, expect } from "@jest/globals";
import { Ship } from "../ship";

it("creates an object when called with new", () => {
  const myShip = new Ship(5);
  expect(typeof myShip).toBe("object");
});

it("takes hits and is sunk after taking as many hits as its length", () => {
  const myShip = new Ship(2);
  expect(myShip.hits === 0);
  myShip.hit();
  expect(myShip.hits === 1);
  expect(myShip.sunk === false);
  myShip.hit();
  expect(myShip.hits === 2);
  expect(myShip.sunk === true);
});
