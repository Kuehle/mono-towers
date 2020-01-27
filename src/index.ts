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
  tick: { rate: number; nr: number };
  field: Image;
  cPos: Coordinate;
  towers: Coordinate[];
  mobs: Coordinate[];
  player: Coordinate;
  goto: Coordinate | null;
}

const createState = (): State => {
  const field = createRect({ width: 24, height: 8, char: "." });
  const { width, height } = measure(field);
  return {
    field,
    cPos: { x: 0, y: 0 },
    towers: [],
    mobs: [],
    tick: {
      rate: 500,
      nr: 0
    },
    player: { x: width - 1, y: Math.floor(height / 2) },
    goto: null
  };
};

let state = createState();

const cursor: Image = ["X"];

const render = (state: State) => {
  const renderField = (state: State) => {
    let output = state.field;

    output = state.towers.reduce(
      (acc, pos) => compose(acc, ["T"], pos),
      output
    );
    output = compose(output, ["@"], state.player);
    output = state.mobs.reduce((acc, pos) => compose(acc, ["M"], pos), output);
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
      break;
    case "m":
      state.mobs.push(state.cPos);
      break;
    case "p":
      state.player = state.cPos;
      break;
    case "g":
      state.goto = state.cPos;
      break;
  }
});

const tick = (state: State) => {
  const moveMobs = (mobs: Coordinate[]) => {
    return mobs.map(({ x, y }) => ({ x: x + 1, y }));
  };
  const movePlayer = (player: Coordinate, goto: Coordinate) => {
    // find delta
    // go to direction that is further away
    if (player.x === goto.x && player.x === goto.x) return player;

    const delta = { x: goto.x - player.x, y: goto.y - player.x };

    const step =
      Math.abs(delta.x) > Math.abs(delta.y)
        ? { x: delta.x / Math.abs(delta.x || 1), y: 0 }
        : { y: delta.y / Math.abs(delta.y || 1), x: 0 };

    const newPlayerposition = { x: player.x + step.x, y: player.y + step.y };
    return newPlayerposition;
  };
  state.mobs = moveMobs(state.mobs);
  state.player = state.goto
    ? movePlayer(state.player, state.goto)
    : state.player;

  state.tick.nr++;
  return state;
};

const gameLoop = async () => {
  while (true) {
    state = tick(state);
    await sleep(state.tick.rate);
  }
};

const renderLoop = async () => {
  while (true) {
    render(state);
    await sleep(16);
  }
};

renderLoop();
gameLoop();
