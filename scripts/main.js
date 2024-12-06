import { Application } from "./application.js";

const defaultSettings = {
  size: 10,
  shipDetails: [
    { index: 0, name: "Carrier", length: 5 },
    { index: 1, name: "Battleship", length: 4 },
    { index: 2, name: "Destroyer", length: 3 },
    { index: 3, name: "Submarine", length: 3 },
    { index: 4, name: "Patrol Boat", length: 2 },
  ],
};

new Application(defaultSettings);
