import { Coordinate, coordinateFromString } from "./coordinate.js";

export function dragAllowDrop(event) {
  if (event.target.classList.contains("clickable")) event.preventDefault();
}

export function drag(event) {
  event.dataTransfer.setData(
    "data-index",
    event.target.getAttribute("data-index"),
  );
}

export function dragEnter(event) {
  if (event.target.classList.contains("clickable"))
    event.target.classList.add("drag-highlight");
}

export function dragLeave(event) {
  event.target.classList.remove("drag-highlight");
}

export function createDragDropHandler(player, shipDetails, display) {
  return function dragDrop(event) {
    if (event.target.classList.contains("clickable")) {
      event.preventDefault();
      event.target.classList.remove("drag-highlight");
      const index = Number(event.dataTransfer.getData("data-index"));
      const coordinate = coordinateFromString(
        event.target.getAttribute("data-coordinate"),
      );
      const horizontalOrVertical = document.querySelector(
        `input[name="ship-orientation-${player.toString()}"]:checked`,
      ).value;
      const direction =
        horizontalOrVertical === "horizontal"
          ? new Coordinate(0, 1)
          : new Coordinate(1, 0);
      const length = shipDetails[index].length;
      player.gameBoard.placeShip(index, coordinate, direction, length);
      display.updatePlayerBoard(
        player,
        `ship-placement-${player.toString()}__board`,
      );
    }
  };
}
