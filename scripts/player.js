import { GameBoard } from "./game-board";

export class Player {
  constructor(size) {
    this.gameBoard = new GameBoard(size);
  }
}
