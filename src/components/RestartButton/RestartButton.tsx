import React from "react";
import classNames from "classnames";
import { GameState } from "@utils/types";

import "./RestartButton.scss";

type Props = {
  state: GameState;
  onClickCallback: () => void;
  isUnknownSmile: boolean;
};

const RestartButton = ({ state, onClickCallback, isUnknownSmile }: Props) => {
  console.log(isUnknownSmile);

  return (
    <button
      onClick={onClickCallback}
      className={classNames("restart-button", {
        [`restart-button-${state}`]: !isUnknownSmile,
        "restart-button-unknown": isUnknownSmile,
      })}
    ></button>
  );
};

export default RestartButton;
