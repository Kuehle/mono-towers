import {
  createRect,
  compose,
  Image,
  Coordinate,
  isInBounds,
  measure
} from "monospace-rendering";
import * as readline from "readline";

const sleep = async (ms: number) =>
  new Promise(resolve => setTimeout(() => resolve(), ms));

interface State {
  field: Image;
  cPos: Coordinate;
  towers: Coordinate[];
}

const createState = (): State => ({
  field: createRect({ width: 24, height: 8, char: "." }),
  cPos: { x: 0, y: 0 },
  towers: []
});

const state = createState();

const cursor: Image = ["X"];

const render = (state: State) => {
  const renderField = (state: State) => {
    let output = state.towers.reduce(
      (acc, towerPos) => compose(acc, ["T"], towerPos),
      state.field
    );
    if (new Date().getTime() % 1000 > 500) {
      output = compose(output, cursor, state.cPos);
    }
    return output;
  };

  const field = renderField(state);

  const { width, height } = measure(field);
  const background = createRect({
    width: width + 4,
    height: height + 2,
    char: "\u2588"
  });
  let output = compose(background, field, { x: 2, y: 1 });

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

process.stdin.on("keypress", (_, key) => {
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
    case "t":
      state.towers.push(state.cPos);
  }
});

const gameloop = async () => {
  while (true) {
    render(state);
    await sleep(16);
  }
};

gameloop();
