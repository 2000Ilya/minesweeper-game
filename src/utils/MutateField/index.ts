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

function addNewMine(field: Field): Coordinates {
  let coordX: number = Math.floor(Math.random() * (FIELD_SIZE * FIELD_SIZE));
  let coordY: number = Math.floor(Math.random() * (FIELD_SIZE * FIELD_SIZE));

  while (field[coordY][coordX].value !== "m") {
    coordX = Math.floor(Math.random() * (FIELD_SIZE * FIELD_SIZE));
    coordY = Math.floor(Math.random() * (FIELD_SIZE * FIELD_SIZE));
  }
  field[coordY][coordX].value = "m";

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (field[coordY + y]) {
        const currentCell = field[coordY + y][coordX + x]?.value;
        if (typeof currentCell === "number") {
          field[coordY + y][coordX + x].value = currentCell + 1;
        }
      }
    }
  }
  return [coordY, coordX];
}

function randomlyTransportMine(
  field: Field,
  minesCoordinates: Array<Coordinates>,
  coordX: number,
  coordY: number
): void {
  let currentCellValue = 0;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (field[coordY + y]) {
        const cell = field[coordY + y][coordX + x]?.value;
        if (cell === "m") {
          currentCellValue += 1;
        }
      }
    }
  }
  field[coordY][coordX].value = currentCellValue;

  for (let i = 0; i < minesCoordinates.length; i++) {
    let mine = minesCoordinates[i];
    if (mine[0] === coordY && mine[1] === coordX) {
      minesCoordinates[i] = addNewMine(field);
    }
    break;
  }
}

export { changeCellState, openMines, openFlags, randomlyTransportMine };
