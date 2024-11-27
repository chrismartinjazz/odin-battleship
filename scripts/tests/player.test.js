import { it, expect } from "@jest/globals";
import { Player } from "../player";
import { Coordinate } from "../coordinate";

it("creates a player object", () => {
  expect(typeof new Player(10, "p1", "human")).toBe("object");
});

it("chooses a coordinate that has not already been fired at", () => {
  const myPlayer = new Player(10, "p1", "computer");
  myPlayer.gameBoard.updateShotsFired({
    coordinate: new Coordinate(0, 0),
    result: "miss",
  });
  myPlayer.gameBoard.updateShotsFired({
    coordinate: new Coordinate(0, 1),
    result: "miss",
  });
  myPlayer.gameBoard.updateShotsFired({
    coordinate: new Coordinate(0, 2),
    result: "miss",
  });
  myPlayer.chooseCoordinate();
});
