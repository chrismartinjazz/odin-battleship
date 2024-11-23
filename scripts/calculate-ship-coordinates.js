export function calculateShipCoordinates(
  startCoordinate,
  directionVector,
  length,
) {
  if (arguments.length !== 3) return;

  let output = [startCoordinate];
  // as many times as the length - 1, add the direction vector to the previous
  // element of the array and push it to output
  for (let i = 0; i < length - 1; i++) {
    const prevCoord = output.at(-1);
    output.push([
      prevCoord[0] + directionVector[0],
      prevCoord[1] + directionVector[1],
    ]);
  }

  return output;
}
