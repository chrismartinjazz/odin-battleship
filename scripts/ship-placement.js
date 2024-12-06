// import { makeElement } from "./make-element.js";

export class shipPlacement {
  constructor(settings, playerOne, playerTwo, display) {
    this.testing = true;

    this.settings = settings;
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.display = display;

    this.dialogShipPlacement = document.querySelector(".dialog-ship-placement");
    this.dialogShipPlacementTitle = document.querySelector(
      ".dialog-ship-placement__title",
    );
    this.dialogShipPlacementBody = document.querySelector(
      ".dialog-ship-placement__body",
    );
    this.dialogShipPlacementShips = document.querySelector(
      ".dialog-ship-placement__ships",
    );
    this.dialogShipPlacementBoard = document.querySelector(
      ".dialog-ship-placement__board",
    );
    this.dialogShipPlacementMessage = document.querySelector(
      ".dialog-ship-placement__message",
    );
    this.dialogShipPlacementButton = document.querySelector(
      ".dialog-ship-placement__button",
    );
  }

  random() {
    console.log("random()");
    this.playerOne.placeShipsRandom(this.settings.shipDetails);
    this.playerTwo.placeShipsRandom(this.settings.shipDetails);
    return true;
  }
}
