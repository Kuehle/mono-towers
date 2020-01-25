import {
  createRect,
  compose,
  Image,
  Coordinate,
  isInBounds
} from "monospace-rendering";
import * as readline from "readline";

const sleep = async (ms: number) =>
  new Promise(resolve => setTimeout(() => resolve(), ms));

interface State {
  field: Image;
  cPos: Coordinate;
}

const createState = () => ({
  field: createRect({ width: 40, height: 10, char: "." }),
  cPos: { x: 0, y: 0 }
});

const state = createState();

const cursor: Image = ["X"];

const render = (state: State) => {
  const output = compose(state.field, cursor, state.cPos);
  process.stdout.write("\u001b[2J\u001b[0;0H");
  console.log(output.join("\n"));
};

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const addCoord = (a: Coordinate, b: Coordinate): Coordinate => {
  return { x: a.x + b.x, y: a.y + b.y };
};

const addInBounds = (img: Image, a: Coordinate, b: Coordinate) => {
  const newCoord = addCoord(a, b);
  return isInBounds(img, newCoord) ? newCoord : a;
};

process.stdin.on("keypress", (str, key) => {
  if (key.sequence === "\u0003") {
    process.exit();
  }
  switch (key.name) {
    case "up":
      state.cPos = addInBounds(state.field, state.cPos, { x: 0, y: -1 });
      break;
    case "down":
      state.cPos = addInBounds(state.field, state.cPos, { x: 0, y: 1 });
      break;
    case "left":
      state.cPos = addInBounds(state.field, state.cPos, { x: -1, y: 0 });
      break;
    case "right":
      state.cPos = addInBounds(state.field, state.cPos, { x: 1, y: 0 });
      break;
  }
});

const gameloop = async () => {
  while (true) {
    render(state);
    await sleep(16);
  }
};

gameloop();
