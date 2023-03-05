import React, { useEffect, useState } from "react";
import Display from "@components/Display";
import { GameState } from "@utils/types";

import "./Stopwatch.scss";

type Props = {
  state: GameState;
};

const Stopwatch = ({ state }: Props) => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const timePassed =
    startTime !== null && currentTime !== null
      ? Math.floor((currentTime.getTime() - startTime.getTime()) / 1000)
      : 0;

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined = undefined;

    if (intervalId === undefined && state === 'playing') {
      setStartTime(new Date());
      intervalId = setInterval(() => {
        console.log("upd");

        setCurrentTime(new Date());
      }, 1000);
    }
    else if (
      (state === "finish" || state === "over" || timePassed > 998) &&
      intervalId !== undefined
    ) {
      // setStartTime(null);
      // setCurrentTime(null);
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId !== undefined) {
        setStartTime(null);
        setCurrentTime(null);
        clearInterval(intervalId);
      }
    };
  }, [state]);

  return <Display value={state === "beforeStart" ? 0 : timePassed} />;
};

export default React.memo(Stopwatch);
