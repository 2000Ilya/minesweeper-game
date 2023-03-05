import React from "react";
import Display from "@components/Display";
import RestartButton from "@components/RestartButton";
import Stopwatch from "@components/Stopwatch";
import { GameState } from "@utils/types";

import "./ControlBar.scss";

type Props = {
  flagsCounter: number;
  state: GameState;
  changeGameState: () => void;
  isUnknownSmile: boolean;
};

const ControlBar = ({
  flagsCounter,
  state,
  changeGameState,
  isUnknownSmile,
}: Props) => {
  return (
    <section className={"control-bar"}>
      <Display value={flagsCounter} />
      <RestartButton
        state={state}
        onClickCallback={changeGameState}
        isUnknownSmile={isUnknownSmile}
      />
      <Stopwatch state={state} />
    </section>
  );
};

export default React.memo(ControlBar);
