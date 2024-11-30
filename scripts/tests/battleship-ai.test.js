import { Player } from "../player.js";
import { Coordinate } from "../coordinate.js";
import { it, expect, describe } from "@jest/globals";

describe("in the initial game state, with board size 3", () => {
  const myPlayer = new Player(3, "p2", "computer");
  const coordinatesUsed = [];

  it("initializes with no shots fired", () => {
    expect(myPlayer.gameBoard.shotsFired).toEqual([]);
  });

  it("does not find a priority one target", () => {
    expect(
      myPlayer.battleshipAi.findPriorityOneTargets(
        myPlayer.gameBoard.shotsFired,
        coordinatesUsed,
      ),
    ).toEqual([]);
  });

  it("does not find a priority two target", () => {
    expect(
      myPlayer.battleshipAi.findPriorityTwoTargets(
        myPlayer.gameBoard.shotsFired,
        coordinatesUsed,
      ),
    ).toEqual([]);
  });

  it("returns the central coordinate, as it has the most adjacent free squares", () => {
    const coordinatesRemaining =
      myPlayer.battleshipAi.findRemainingCoordinates(coordinatesUsed);
    const result =
      myPlayer.battleshipAi.chooseSortedRandomTarget(coordinatesRemaining);
    expect(typeof result).toBe("object");
    expect(result).toEqual(new Coordinate(1, 1));
  });
});

describe("when there are two lines and one isolated hit", () => {
  /*
        0 1 2 3 4
      0         H
      1 1 H H 1 H
      2   2     H
      3 2 H 2   1
      4   2
      
      Hits:
        0,4 1,2 1,2 1,4 2,4 3,1
      AI Goal:
        Priority 1: 1,0 1,3 3,4
        Priority 2: 3,2 4,1 3,0 2,1
        Priority 3: The rest
      */
  const hits = [
    [0, 4],
    [1, 1],
    [1, 2],
    [1, 4],
    [2, 4],
    [3, 1],
  ];
  let myPlayer = init(hits);
  it("initializes the ship and shots fired", () => {
    let result = [];
    for (const hit of hits) {
      result.push({
        coordinate: new Coordinate(hit[0], hit[1]),
        result: "hit",
        sunk: null,
      });
    }

    expect(myPlayer.gameBoard.shotsFired).toEqual(result);
  });

  it("identifies the isolated hit", () => {
    expect(
      myPlayer.battleshipAi.findIsolatedHits(myPlayer.gameBoard.shotsFired),
    ).toEqual([new Coordinate(3, 1)]);
  });

  it("finds adjacent coordinates to a given coordinate", () => {
    expect(
      myPlayer.battleshipAi.findAdjacentCoordinates(new Coordinate(1, 1)),
    ).toEqual([
      new Coordinate(1, 2),
      new Coordinate(2, 1),
      new Coordinate(1, 0),
      new Coordinate(0, 1),
    ]);
    expect(
      myPlayer.battleshipAi.findAdjacentCoordinates(new Coordinate(0, 0)),
    ).toEqual([new Coordinate(0, 1), new Coordinate(1, 0)]);
  });

  it("identifies priority 2 targets", () => {
    //Priority 2: 3,2 4,1 3,0 2,1
    expect(
      myPlayer.battleshipAi.findPriorityTwoTargets(
        myPlayer.gameBoard.shotsFired,
      ),
    ).toEqual([
      new Coordinate(3, 2),
      new Coordinate(4, 1),
      new Coordinate(3, 0),
      new Coordinate(2, 1),
    ]);
  });

  it("identifies coordinates at the end of a line", () => {
    expect(
      myPlayer.battleshipAi.findEndOfLineCoordinate(
        new Coordinate(1, 1), // coordinate
        new Coordinate(0, 1), // directionVector
        myPlayer.gameBoard.shotsFired
          .filter((shot) => shot.result === "hit")
          .map((shot) => shot.coordinate), // hitCoordinates
      ),
    ).toEqual(new Coordinate(1, 3));
    expect(
      myPlayer.battleshipAi.findEndOfLineCoordinate(
        new Coordinate(1, 1), // coordinate
        new Coordinate(0, -1), // directionVector
        myPlayer.gameBoard.shotsFired
          .filter((shot) => shot.result === "hit")
          .map((shot) => shot.coordinate), // hitCoordinates
      ),
    ).toEqual(new Coordinate(1, 0));
  });

  it("identifies all coordinates at the end of lines", () => {
    expect(
      myPlayer.battleshipAi.findEndOfLineCoordinates(
        myPlayer.gameBoard.shotsFired,
      ),
    ).toEqual([
      new Coordinate(3, 4),
      new Coordinate(1, 3),
      new Coordinate(1, 0),
    ]);
  });

  it("identifies priority one targets", () => {
    expect(
      myPlayer.battleshipAi.findPriorityOneTargets(
        myPlayer.gameBoard.shotsFired,
      ),
    ).toEqual([
      new Coordinate(3, 4),
      new Coordinate(1, 3),
      new Coordinate(1, 0),
    ]);
  });

  it("chooses a priority one target", () => {
    const result = myPlayer.battleshipAi.chooseCoordinate();
    console.log(result);
    expect(
      result.isEqual(new Coordinate(3, 4)) ||
        result.isEqual(new Coordinate(1, 3)) ||
        result.isEqual(new Coordinate(1, 0)),
    ).toBe(true);
  });
});

describe("when there are two lines of hits, with one sunk, and a number of misses", () => {
  /*
        0 1 2 3 4
      0         H
      1 X H H 1 Sunk
      2   X     H
      3 X H X   
      4   2
      
      Hits:
        0,4 1,1 1,2 1,4(Sunk) 2,4 3,1
      Misses:
        1,0 2,1 3,0 3,2
      AI Goal:
        Priority 1: 1,3
        Priority 2: 4,1
        Priority 3: The rest
      */
  const hits = [
    [0, 4],
    [1, 1],
    [1, 2],
    [1, 4, 1],
    [2, 4],
    [3, 1],
  ];
  const misses = [
    [1, 0],
    [2, 1],
    [3, 0],
    [3, 2],
  ];
  let myPlayer = init(hits, misses);
  it("correctly initializes the shotsFired", () => {
    let result = [];
    for (const hit of hits) {
      result.push({
        coordinate: new Coordinate(hit[0], hit[1]),
        result: "hit",
        sunk: hit[2] || null,
      });
    }
    for (const miss of misses) {
      result.push({
        coordinate: new Coordinate(miss[0], miss[1]),
        result: "miss",
        sunk: null,
      });
    }
    expect(myPlayer.gameBoard.shotsFired).toEqual(result);
  });

  const coordinatesUsed = myPlayer.gameBoard.coordinateList(
    myPlayer.gameBoard.shotsFired,
  );

  it("correctly identifies the priority one targets", () => {
    expect(
      myPlayer.battleshipAi.findPriorityOneTargets(
        myPlayer.gameBoard.shotsFired,
        coordinatesUsed,
      ),
    ).toEqual([new Coordinate(1, 3)]);
  });

  it("correctly identifies the priority two targets", () => {
    expect(
      myPlayer.battleshipAi.findPriorityTwoTargets(
        myPlayer.gameBoard.shotsFired,
        coordinatesUsed,
      ),
    ).toEqual([new Coordinate(4, 1)]);
  });

  it("chooses the priority one target", () => {
    expect(myPlayer.battleshipAi.chooseCoordinate()).toEqual(
      new Coordinate(1, 3),
    );
  });
});

function init(hits = [], misses = []) {
  const myPlayer = new Player(10, "p2", "computer");
  for (const hit of hits) {
    myPlayer.gameBoard.updateShotsFired({
      coordinate: new Coordinate(hit[0], hit[1]),
      result: "hit",
      sunk: hit[2] || null,
    });
  }
  for (const miss of misses) {
    myPlayer.gameBoard.updateShotsFired({
      coordinate: new Coordinate(miss[0], miss[1]),
      result: "miss",
      sunk: null,
    });
  }
  return myPlayer;
}
