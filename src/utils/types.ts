type MinesDensity = number;

type Mine = "m";

type CellState =
  | "closed"
  | "opened"
  | "flagged"
  | "questioned"
  | "mine-lack"
  | "mine-exploded";

type FieldItem = {
  value: MinesDensity | Mine;
  state: CellState;
};

type Field = FieldItem[][];

type Coordinates = [number, number];

type GameState = "beforeStart" | "playing" | "finish" | "over";

type GameState1 = {
  state: "playing" | "over";
  opened: number;
};

type Data = {
  gameState: GameState;
  field: [Field, Array<Coordinates>];
  flagsCounter: number;
  openedCounter: number;
};

export type {
  MinesDensity,
  Mine,
  FieldItem,
  Field,
  Coordinates,
  CellState,
  GameState,
  Data,
};
