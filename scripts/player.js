import { GameBoard } from "./game-board.js";

export class Player {
  constructor(size) {
    this.gameBoard = new GameBoard(size);
  }
}
