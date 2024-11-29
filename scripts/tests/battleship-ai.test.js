import { Player } from "../player.js";
import { Coordinate } from "../coordinate.js";
import { it, expect } from "@jest/globals";

function init() {
  // Player has a ship on 1,1 1,2 1,3.
  // Hits received on 1,1 and 1,2
  const myPlayer = new Player(10, "p2", "computer");
  myPlayer.gameBoard.updateShotsFired({
    coordinate: new Coordinate(1, 1),
    result: "hit",
    sunk: null,
  });
  myPlayer.gameBoard.updateShotsFired({
    coordinate: new Coordinate(1, 2),
    result: "hit",
    sunk: null,
  });
  myPlayer.gameBoard.updateShotsFired({
    coordinate: new Coordinate(2, 1),
    result: "miss",
    sunk: null,
  });
  myPlayer.gameBoard.updateShotsFired({
    coordinate: new Coordinate(2, 2),
    result: "miss",
    sunk: null,
  });
  myPlayer.gameBoard.updateShotsFired({
    coordinate: new Coordinate(2, 3),
    result: "hit",
    sunk: null,
  });

  return myPlayer;
}

it("initializes the ship and shots fired", () => {
  let myPlayer = init();
  let result = [
    { coordinate: new Coordinate(1, 1), result: "hit", sunk: null },
    { coordinate: new Coordinate(1, 2), result: "hit", sunk: null },
    { coordinate: new Coordinate(2, 1), result: "miss", sunk: null },
    { coordinate: new Coordinate(2, 2), result: "miss", sunk: null },
    { coordinate: new Coordinate(2, 3), result: "hit", sunk: null },
  ];
  expect(myPlayer.gameBoard.shotsFired).toEqual(result);
});
