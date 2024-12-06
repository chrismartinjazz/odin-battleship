import { Application } from "./application.js";

const defaultSettings = {
  size: 10,
  shipDetails: [
    { name: "Carrier", length: 5 },
    { name: "Battleship", length: 4 },
    { name: "Destroyer", length: 3 },
    { name: "Submarine", length: 3 },
    { name: "Patrol Boat", length: 2 },
  ],
};

new Application(defaultSettings);
