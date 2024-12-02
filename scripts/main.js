import { Application } from "./application.js";

let myApp = null;

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

// Initialize the opening form
const dialogGetPlayerChoices = document.querySelector(
  ".dialog-get-player-choices",
);
const form = document.querySelector(".form-get-player-choices");

initializeDialogGetPlayerChoices();
dialogGetPlayerChoices.showModal();

function initializeDialogGetPlayerChoices() {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const opponentType = document.querySelector(
      'input[name="opponentType"]:checked',
    );
    const shipPlacement = document.querySelector(
      'input[name="shipPlacement"]:checked',
    );

    const settings = defaultSettings;
    settings.opponentType = opponentType.value;
    settings.shipPlacement = shipPlacement.value;

    dialogGetPlayerChoices.close();
    // Start a new instance of the application with the user's chosen options.
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
  // Reset the app if it is somehow running.
  if (myApp) {
    myApp.reset();
  }
  myApp = new Application(settings);
}
