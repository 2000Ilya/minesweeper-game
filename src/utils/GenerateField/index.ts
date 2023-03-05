import { FIELD_SIZE, MINES_NUMBER } from "@utils/constants";
import { Coordinates, Field } from "../types";

function generateMinesCoordinates(): Array<Coordinates> {
  const minesCells: number[] = [];
  while (minesCells.length < MINES_NUMBER) {
    let randomMineCell = Math.floor(Math.random() * (FIELD_SIZE * FIELD_SIZE));
    if (minesCells.indexOf(randomMineCell) === -1) {
      minesCells.push(randomMineCell);
    }
  }

  const minesCoordinates: Array<Coordinates> = minesCells.map((cellIndex) => {
    const columnIndex = cellIndex % FIELD_SIZE;
    const rowIndex = Math.floor(cellIndex / FIELD_SIZE);

    return [columnIndex, rowIndex];
  });

  return minesCoordinates;
}

function addMinesAndDensities(
  field: Field,
  minesCoordinates: Array<Coordinates>
): void {
  for (let i = 0; i < minesCoordinates.length; i++) {
    const x = minesCoordinates[i][0];
    const y = minesCoordinates[i][1];

    field[y][x].value = "m";
    increaseDensitiesAroundMine(field, y, x);
  }
}

function increaseDensitiesAroundMine(
  field: Field,
  coordY: number,
  coordX: number
): void {
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
}

function generateField(): [Field, Array<Coordinates>] {
  const minesCoordinates: Array<Coordinates> = generateMinesCoordinates();

  const field: Field = new Array(FIELD_SIZE)
    .fill(null)
    .map((row) =>
      new Array(FIELD_SIZE)
        .fill(null)
        .map((cell) => ({ value: 0, state: "closed" }))
    );

  addMinesAndDensities(field, minesCoordinates);
  return [field, minesCoordinates];
}

export default generateField;
