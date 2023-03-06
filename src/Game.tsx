import React, { useCallback, useState } from "react";
import Cell from "@components/Cell";
import generatedField from "@utils/GenerateField";
import { CellState, Coordinates, Data, Field, GameState } from "@utils/types";
import { changeCellState, randomlyTransportMine } from "@utils/MutateField";

import "./Game.scss";
import ControlBar from "@components/ControlBar";
import { MINES_NUMBER } from "@utils/constants";

function App() {
  const [data, setData] = useState<Data>({
    gameState: "beforeStart",
    field: generatedField(),
    flagsCounter: MINES_NUMBER,
    openedCounter: 0,
  });
  const [isUnknownSmile, setUnknownSmile] = useState(false);

  const handleChangeGameState = useCallback((state: GameState): void => {
    if (state === "beforeStart") {
      setData((data) => ({
        ...data,
        gameState: "beforeStart",
        field: generatedField(),
        flagsCounter: MINES_NUMBER,
      }));
    } else if (state === "playing") {
      setData((data) => ({
        ...data,
        gameState: "playing",
      }));
    } else if (state === "over") {
      setData((data) => ({
        ...data,
        gameState: "over",
      }));
    } else if (state === "finish") {
      setData((data) => ({
        ...data,
        gameState: "finish",
      }));
    }
  }, []);

  const restartGame = useCallback(() => {
    handleChangeGameState("beforeStart");
  }, []);

  const handleChangeSmile = useCallback((isUnknownSmile: boolean) => {
    setUnknownSmile(isUnknownSmile);
  }, []);

  const handleChangeCell = (
    state: CellState,
    eventType: string,
    coordX: number,
    coordY: number
  ): void => {

    if (data.gameState !== "over") {
      setData((data) => {
        const newField = data.field[0].map((row) => row);
        const minesCoordinates = data.field[1].map((coord) => coord);
        if (
          newField[coordY][coordX].value === "m" &&
          data.gameState === "beforeStart"
        ) {
          randomlyTransportMine(newField, minesCoordinates, coordX, coordY);
        }
        changeCellState(
          newField,
          state,
          eventType,
          coordX,
          coordY,
          data.field[1],
          data.flagsCounter,
          data.openedCounter,
          () => {
            setData((data) => ({
              ...data,
              gameState: "over",
            }));
          },
          () => {
            setData((data) => ({
              ...data,
              gameState: "finish",
            }));
          },
          () => {
            setData((data) => ({
              ...data,
              flagsCounter: data.flagsCounter - 1,
            }));
          },
          () => {
            setData((data) => ({
              ...data,
              flagsCounter: data.flagsCounter + 1,
            }));
          },
          () => {
            setData((data) => ({
              ...data,
              openedCounter: data.openedCounter + 1,
            }));
          }
        );
        return { ...data, field: [newField, minesCoordinates] };
      });
    }
    if (data.gameState === "beforeStart") {
      setData((data) => ({
        ...data,
        gameState: "playing",
      }));
    }
  };

  return (
    <div className={"game-vidget"}>
      <ControlBar
        isUnknownSmile={isUnknownSmile}
        changeGameState={restartGame}
        flagsCounter={data.flagsCounter}
        state={data.gameState}
      />
      <div className={"field"}>
        {data.field[0].map((row, rowIndex) => (
          <div className={"row"} key={rowIndex}>
            {row.map((cell, columnIndex) => {
              return (
                <Cell
                  gameState={data.gameState}
                  key={rowIndex * 16 + columnIndex}
                  state={cell.state}
                  cellValue={cell.value}
                  onChange={(state: CellState, eventType: string) => {
                    handleChangeCell(state, eventType, columnIndex, rowIndex);
                  }}
                  onMouseDown={() => handleChangeSmile(true)}
                  onMouseUp={() => handleChangeSmile(false)}
                />
              );
            })}
          </div>
        ))}
        {/* <Cell isVisited={true} cellType={"mine-red"} />
      <Cell isVisited={true} cellType={"mine-exploded"} /> */}
      </div>
    </div>
  );
}

export default App;
