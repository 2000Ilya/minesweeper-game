import React from "react";
import classNames from "classnames";
import { CellState, GameState, Mine, MinesDensity } from "@utils/types";

import "./Cell.scss";

type Props = {
  gameState: GameState;
  onChange: (state: CellState, eventType: string) => void;
  state: CellState;
  cellValue: MinesDensity | Mine;
  onMouseDown: () => void;
  onMouseUp: () => void;
};

const Cell = ({
  gameState,
  state,
  cellValue,
  onChange,
  onMouseDown,
  onMouseUp,
}: Props) => {
  const handleClick = (event: React.MouseEvent): void => {
    event.preventDefault();
    onChange(state, event.type);
  };

  return (
    <button
      onClick={(event: React.MouseEvent) => handleClick(event)}
      onContextMenu={(event: React.MouseEvent) => handleClick(event)}
      onMouseDown={() => {
        onMouseDown();
      }}
      onMouseUp={() => {
        onMouseUp();
      }}
      className={classNames({
        cell: true,
        [`cell__${cellValue}`]: state === "opened",
        [`cell__${state}`]: state !== "opened" || gameState === "over",
      })}
    ></button>
  );
};

export default Cell;
