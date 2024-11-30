import { Application } from "./application.js";

let myApp = null;

const dialogGetPlayerChoices = document.querySelector(
  ".dialog-get-player-choices",
);
const form = document.querySelector(".form-get-player-choices");
const defaultSettings = {
  size: 10,
  shipDetails: [
    { name: "Carrier", length: 5 },
    { name: "Battleship", length: 4 },
    { name: "Destroyer", length: 3 },
    { name: "Submarine", length: 3 },
    { name: "Patrol Boat", length: 2 },
  ],
  opponentType: "computer",
  shipPlacement: "random",
};

initializeDialogGetPlayerChoices();
dialogGetPlayerChoices.showModal();

function initializeDialogGetPlayerChoices() {
  form.addEventListener("submit", (event) => {
    const opponentType = document.querySelector(
      'input[name="opponentType"]:checked',
    );
    const shipPlacement = document.querySelector(
      'input[name="shipPlacement"]:checked',
    );
    event.preventDefault();

    const settings = defaultSettings;
    settings.opponentType = opponentType.value;
    settings.shipPlacement = shipPlacement.value;

    dialogGetPlayerChoices.close();
    initializeApplication(settings);
  });
}

dialogGetPlayerChoices.addEventListener("close", () => {
  // Handle case where user closes the dialog without submitting it
  if (!myApp) {
    initializeApplication(defaultSettings);
  }
});

function initializeApplication(settings) {
  if (myApp) {
    myApp.reset();
  }
  myApp = new Application(settings);
}
