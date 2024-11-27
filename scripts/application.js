import { Player } from "./player.js";
import { Coordinate, coordinateFromString } from "./coordinate.js";
import { Display } from "./display.js";

export class Application {
  constructor(
    size = 10,
    shipDetails = [
      { name: "Carrier", length: 5 },
      { name: "Battleship", length: 4 },
      { name: "Destroyer", length: 3 },
      { name: "Submarine", length: 3 },
      { name: "Patrol Boat", length: 2 },
    ],
  ) {
    this.size = size;
    this.shipDetails = shipDetails;
    this.playerOne = new Player(size, "p1", "human");
    this.playerTwo = new Player(size, "p2", "computer");
    this.currentPlayer = this.playerOne;
    this.inactivePlayer = this.playerTwo;
    this.display = new Display(
      this.size,
      this.shipDetails,
      this.playerOne,
      this.playerTwo,
    );

    // For testing - TODO remove
    this.testPlaceShips(this.playerOne);
    this.testPlaceShips(this.playerTwo);
    //

    this.setActivePlayerEventListener(this.display.p1OpponentBoard);
  }

  setActivePlayerEventListener(board) {
    board.addEventListener(
      "click",
      (event) => {
        const coordinateString = event.target.getAttribute("data-coordinate");
        console.log(coordinateString);

        const gameOver = this.takeTurn(coordinateString);
        if (!gameOver) {
          this.swapCurrentPlayer();

          if (this.currentPlayer.type == "human") {
            this.setActivePlayerEventListener(
              this.currentPlayer == this.playerOne
                ? this.display.p1OpponentBoard
                : this.display.p2OpponentBoard,
            );
          } else {
            // current player is computer
            const gameOver = this.takeTurn(
              this.currentPlayer.chooseCoordinate().toString(),
            );
            if (!gameOver) {
              this.swapCurrentPlayer();
              this.setActivePlayerEventListener(
                this.currentPlayer == this.playerOne
                  ? this.display.p1OpponentBoard
                  : this.display.p2OpponentBoard,
              );
            }
          }
        }
      },
      { once: true },
    );
  }

  takeTurn(coordinateString) {
    this.fireShot(
      this.currentPlayer,
      this.inactivePlayer,
      coordinateFromString(coordinateString),
    );

    this.display.updateOpponentBoard(
      this.currentPlayer,
      `${this.currentPlayer.toString()}-opponent-board`,
    );
    this.display.updatePlayerBoard(
      this.inactivePlayer,
      `${this.inactivePlayer.toString()}-player-board`,
    );

    if (this.inactivePlayer.gameBoard.allShipsSunk()) {
      alert(`${this.currentPlayer.toString()} wins!`);
      return true;
    } else {
      return false;
    }
  }

  fireShot(firingPlayer, receivingPlayer, coordinate) {
    // The receiving player receives the attack, and feeds back the result.
    // The firing player updates their record of shots fired with the coordinates
    // and result (which can be "hit", "miss" or "error")
    const result = receivingPlayer.gameBoard.receiveAttack(coordinate);
    if (result) firingPlayer.gameBoard.updateShotsFired(result);
  }

  swapCurrentPlayer() {
    this.currentPlayer =
      this.currentPlayer == this.playerOne ? this.playerTwo : this.playerOne;
    this.inactivePlayer =
      this.inactivePlayer == this.playerOne ? this.playerTwo : this.playerOne;
  }

  testGameLoop() {
    // const attacks = [
    //   new Coordinate(0, 0),
    //   new Coordinate(0, 0),
    //   new Coordinate(0, 0),
    //   new Coordinate(0, 1),
    //   new Coordinate(0, 2),
    //   new Coordinate(0, 3),
    //   new Coordinate(0, 4),
    //   new Coordinate(0, 5),
    //   new Coordinate(0, 6),
    //   new Coordinate(0, 7),
    //   new Coordinate(0, 8),
    // ];

    // const attacks1 = [
    //   new Coordinate(0, 0),
    //   new Coordinate(0, 0),
    //   new Coordinate(0, 0),
    //   new Coordinate(0, 1),
    //   new Coordinate(0, 2),
    //   new Coordinate(0, 3),
    //   new Coordinate(0, 4),
    //   new Coordinate(0, 5),
    //   new Coordinate(0, 6),
    //   new Coordinate(0, 7),
    //   new Coordinate(0, 8),
    //   new Coordinate(0, 11),
    //   new Coordinate(0, 12),
    //   new Coordinate(1, 0),
    //   new Coordinate(1, 1),
    //   new Coordinate(1, 2),
    //   new Coordinate(1, 3),
    //   new Coordinate(2, 0),
    //   new Coordinate(2, 1),
    //   new Coordinate(2, 2),
    //   new Coordinate(3, 0),
    //   new Coordinate(3, 1),
    //   new Coordinate(3, 2),
    //   new Coordinate(4, 0),
    //   new Coordinate(4, 1),
    // ];

    this.testPlaceShips(this.playerOne);
    this.testPlaceShips(this.playerTwo);
    // attacks.forEach((attack) => {
    //   this.fireShot(this.playerOne, this.playerTwo, attack);
    //   this.fireShot(this.playerTwo, this.playerOne, attack);
    //   console.log(
    //     this.playerOne.gameBoard.shipsSunk(),
    //     this.playerTwo.gameBoard.shipsSunk(),
    //   );
    // });
    // console.log(
    //   this.playerOne.gameBoard.allShipsSunk(),
    //   this.playerTwo.gameBoard.allShipsSunk(),
    // );
    // console.log(this);
  }

  testPlaceShips(player) {
    for (let row = 0; row < this.shipDetails.length; row++) {
      const start = new Coordinate(row, 0);
      const vector = new Coordinate(0, 1);
      player.gameBoard.placeShip(start, vector, this.shipDetails[row].length);
    }
  }
}
