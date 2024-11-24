import { it, expect } from "@jest/globals";
import { Player } from "../player";

it("creates a player object", () => {
  expect(typeof new Player(10)).toBe("object");
});
