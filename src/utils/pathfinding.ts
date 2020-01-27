import { Coordinate, Image } from "monospace-rendering";

type Coord = [number, number, number];
// function getStart() {
//   for (y = 0; y < arr.length; y++) {
//     for (x = 0; x < arr[y].length; x++) {
//       if (arr[y][x] == "s") {
//         return [x, y];
//       }
//     }
//   }
// }

function getLowestNeighbor(coord: Coord, explored: Coord[]): Coord {
  let [x, y] = coord;
  let lowest: Coord | null = null;
  for (let i = explored.length - 1; i >= 0; i--) {
    let [x2, y2, c2] = explored[i];
    if (
      (x2 == x - 1 && y2 == y) ||
      (x2 == x + 1 && y2 == y) ||
      (x2 == x && y2 == y - 1) ||
      (x2 == x && y2 == y + 1)
    ) {
      if (lowest === null || c2 < lowest[2]) {
        lowest = explored[i];
      }
    }
  }
  // could this still be null?
  return lowest!;
}

function filterNeighbors(neighbors: Coord[], explored: Coord[]): Coord[] {
  let remaining: Coord[] = [];
  for (let i = 0; i < neighbors.length; i++) {
    let alreadyExplored = false;
    for (let j = 0; j < explored.length; j++) {
      if (
        neighbors[i][0] == explored[j][0] &&
        neighbors[i][1] == explored[j][1]
      ) {
        if (neighbors[i][2] < explored[j][2]) {
          explored[j][2] = neighbors[i][2];
        }
        alreadyExplored = true;
      }
    }
    if (!alreadyExplored) {
      remaining.push(neighbors[i]);
    }
  }
  return remaining;
}

function getNeighbors(area: Image, coord: Coord) {
  let [x, y, c] = coord;
  let neighbors: Coord[] = [];
  if (x > 0) {
    if (area[y][x - 1] != "x") {
      neighbors.push([x - 1, y, c + 1]);
    }
  }
  if (x < area[0].length - 1) {
    if (area[y][x + 1] != "x") {
      neighbors.push([x + 1, y, c + 1]);
    }
  }
  if (y > 0) {
    if (area[y - 1][x] != "x") {
      neighbors.push([x, y - 1, c + 1]);
    }
  }
  if (y < area.length - 1) {
    if (area[y + 1][x] != "x") {
      neighbors.push([x, y + 1, c + 1]);
    }
  }
  return neighbors;
}

// function getGoal() {
//   for (y = 0; y < arr.length; y++) {
//     for (x = 0; x < arr[y].length; x++) {
//       if (arr[y][x] == "o") {
//         return [x, y, 0];
//       }
//     }
//   }
// }

export const findPath = (area: Image, start: Coordinate, end: Coordinate) => {
  //  Coordinate[]

  const queue: Coord[] = [];
  const explored: Coord[] = [];

  const foo: Coord = [end.x, end.y, 0]; // @TODO find out what last one does

  queue[0] = foo; // getGoal()
  explored[0] = queue[0];

  let finished = false;
  while ((queue.length = 0 && !finished)) {
    let current = queue[0];
    queue.splice(0, 1);
    let neighbors = getNeighbors(area, current);
    neighbors = filterNeighbors(neighbors, explored);
    for (let i = 0; i < neighbors.length; i++) {
      let x = neighbors[i][0];
      let y = neighbors[i][1];
      if (x === foo[0] && y === foo[1]) {
        finished = true;
        break;
      }
      explored.push(neighbors[i]);
      queue.push(neighbors[i]);
    }
  }

  const shortestPath = [];
  let goal: Coord = [end.x, end.y, 0]; //getGoal();
  // goal = [goal[0], goal[1]];
  let current: Coord = [start.x, start.y, 0];
  shortestPath.push(current);

  while (current[0] != goal[0] || current[1] != goal[1]) {
    current = getLowestNeighbor(current, explored);
    shortestPath.push(current);
  }
  console.log(shortestPath);
};
