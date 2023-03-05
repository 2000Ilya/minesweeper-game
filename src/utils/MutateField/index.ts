import { FIELD_SIZE, MINES_NUMBER } from "@utils/constants";
import {
  CellState,
  Coordinates,
  Field,
  Mine,
  MinesDensity,
} from "@utils/types";

function changeCellState(
  field: Field,
  currentState: CellState,
  eventType: string,
  coordX: number,
  coordY: number,
  minesCoordinates: Array<Coordinates>,
  flagsCounter: number,
  openedCounter: number,
  gameOverCallback: () => void,
  gameFinishedCallback: () => void,
  flagAddedCallback: () => void,
  flagRemovedCallback: () => void,
  openCellCallback: () => void
): void {
  if (eventType === "contextmenu") {
    if (currentState === "closed") {
      if (flagsCounter !== 0) {
        field[coordY][coordX].state = "flagged";
        flagAddedCallback();
      } else {
        field[coordY][coordX].state = "questioned";
      }
    } else if (currentState === "flagged") {
      field[coordY][coordX].state = "questioned";
      flagRemovedCallback();
    } else if (currentState === "questioned") {
      field[coordY][coordX].state = "closed";
    }
  } else if (eventType === "click") {
    if (currentState === "closed" || currentState === "questioned") {
      if (field[coordY][coordX].value === "m") {
        openMines(field, minesCoordinates);
        field[coordY][coordX].state = "mine-exploded";
        openFlags(field);
        gameOverCallback();
      } else if (field[coordY][coordX].value === 0) {
        openEmptyIsland(field, coordY, coordX);
      } else {
        field[coordY][coordX].state = "opened";
        openCellCallback();
        if (openedCounter === FIELD_SIZE * FIELD_SIZE - MINES_NUMBER) {
          gameFinishedCallback();
        }
      }
    }
  }
}

function openEmptyIsland(field: Field, coordY: number, coordX: number): void {
  field[coordY][coordX].state = "opened";

  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      if (!(x === 0 && y === 0)) {
        const cell = field[coordY + y]?.[coordX + x];
        if (cell?.state !== "opened") {
          if (cell?.value === 0) {
            openEmptyIsland(field, coordY + y, coordX + x);
          } else if (cell && cell.value !== "m") {
            field[coordY + y][coordX + x].state = "opened";
          }
        }
      }
    }
  }
}

function openMines(field: Field, minesCoordinates: Array<Coordinates>): void {
  for (let i = 0; i < minesCoordinates.length; i++) {
    const x = minesCoordinates[i][0];
    const y = minesCoordinates[i][1];

    field[y][x].state = "opened";
  }
}

function openFlags(field: Field): void {
  console.log("lol");

  for (let rowIndex = 0; rowIndex < field.length; rowIndex++) {
    for (let colIndex = 0; colIndex < field[rowIndex].length; colIndex++) {
      if (
        field[rowIndex][colIndex].value !== "m" &&
        field[rowIndex][colIndex].state === "flagged"
      ) {
        field[rowIndex][colIndex].state = "mine-lack";
      }
    }
  }
}

function addNewMine(field: Field) {
  let x: number = Math.floor(Math.random() * (FIELD_SIZE * FIELD_SIZE))
  let y: number = Math.floor(Math.random() * (FIELD_SIZE * FIELD_SIZE))

  while (field[y][x].value !== 'm') {
    x = Math.floor(Math.random() * (FIELD_SIZE * FIELD_SIZE))
    y = Math.floor(Math.random() * (FIELD_SIZE * FIELD_SIZE))
  }
  field[y][x].value = 'm';
}

function randomlyTransportMine(
  field: Field,
  minesCoordinates: Array<Coordinates>,
  coordX: number,
  coordY: number
): void {
  let currentCell = 0;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (field[coordY + y]) {
        const cell = field[coordY + y][coordX + x]?.value;
        if (cell === 'm') {
          currentCell += 1;
        }
      }
    }
  }
  field[coordY][coordX].value = currentCell

  for (let i = 0; i < minesCoordinates.length; i++) {
    let mine = minesCoordinates[i];
    if (mine[0] === coordY && mine[1] === coordX) {

    }
  }
}

export { changeCellState, openMines, openFlags, randomlyTransportMine };
