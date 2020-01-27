import { findPath } from "../pathfinding";
import { Image } from "monospace-rendering";

describe("The pathfinding util", () => {
  it("finds a path", () => {
    const labyrinth: Image = [
      "xxxxxxxxxx",
      "x___xx_x_x",
      "x_x__x___x",
      "x_xx___x_x",
      "x_x__x___x",
      "x___xx_x_x",
      "x_x__x_x_x",
      "x_xx___x_x",
      "x____x___x",
      "xxxxxxxxxx"
    ];
    const result = findPath(labyrinth, { x: 1, y: 1 }, { x: 3, y: 8 });
    expect(result).toBe(5);
  });
});
