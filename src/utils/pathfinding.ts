import { Coordinate, Image } from "monospace-rendering";

const arr = [
  "xxxxxxxxxx",
  "x___xx_x_x",
  "x_x__x___x",
  "xsxx___x_x",
  "x_x__x___x",
  "x___xx_x_x",
  "x_x__x_x_x",
  "x_xx___x_x",
  "x__o_x___x",
  "xxxxxxxxxx"
];

const queue = [];
const explored = [];

queue[0] = getGoal();
explored[0] = queue[0];

let finished = false;
while (!queue.length == 0 && !finished) {
  let current = queue[0];
  queue.splice(0, 1);
  let neighbors = getNeighbors(current[0], current[1], current[2]);
  neighbors = filterNeighbors(neighbors);
  for (i = 0; i < neighbors.length; i++) {
    let x = neighbors[i][0];
    let y = neighbors[i][1];
    if (arr[y][x] == "s") {
      finished = true;
      break;
    }
    explored.push(neighbors[i]);
    queue.push(neighbors[i]);
  }
}

const shortestPath = [];
let goal = getGoal();
goal = [goal[0], goal[1]];
let current = getStart();
shortestPath.push(current);

while (current[0] != goal[0] || current[1] != goal[1]) {
  current = getLowestNeighbor(current[0], current[1]);
  shortestPath.push(current);
}
console.log(shortestPath);

function getStart() {
  for (y = 0; y < arr.length; y++) {
    for (x = 0; x < arr[y].length; x++) {
      if (arr[y][x] == "s") {
        return [x, y];
      }
    }
  }
}

function getLowestNeighbor(x, y) {
  let lowest = [];
  for (i = explored.length - 1; i >= 0; i--) {
    let x2 = explored[i][0];
    let y2 = explored[i][1];
    let c2 = explored[i][2];
    if (
      (x2 == x - 1 && y2 == y) ||
      (x2 == x + 1 && y2 == y) ||
      (x2 == x && y2 == y - 1) ||
      (x2 == x && y2 == y + 1)
    ) {
      if (lowest.length == 0 || c2 < lowest[2]) {
        lowest = explored[i];
      }
    }
  }
  return [lowest[0], lowest[1]];
}

function filterNeighbors(neighbors) {
  let remaining = [];
  for (i = 0; i < neighbors.length; i++) {
    let alreadyExplored = false;
    for (j = 0; j < explored.length; j++) {
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

function getNeighbors(x, y, c) {
  let neighbors = [];
  if (x > 0) {
    if (arr[y][x - 1] != "x") {
      neighbors.push([x - 1, y, c + 1]);
    }
  }
  if (x < arr[0].length - 1) {
    if (arr[y][x + 1] != "x") {
      neighbors.push([x + 1, y, c + 1]);
    }
  }
  if (y > 0) {
    if (arr[y - 1][x] != "x") {
      neighbors.push([x, y - 1, c + 1]);
    }
  }
  if (y < arr.length - 1) {
    if (arr[y + 1][x] != "x") {
      neighbors.push([x, y + 1, c + 1]);
    }
  }
  return neighbors;
}

function getGoal() {
  for (y = 0; y < arr.length; y++) {
    for (x = 0; x < arr[y].length; x++) {
      if (arr[y][x] == "o") {
        return [x, y, 0];
      }
    }
  }
}

export const findPath = (
  area: Image,
  start: Coordinate,
  end: Coordinate
): Coordinate[] => {};
