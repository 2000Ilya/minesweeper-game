import React from "react";
import classNames from "classnames";

import "./Display.scss";

type Props = {
  value: number;
};

const DISPLAY_LENGTH = 3;

const getDigits = (value: number): number[] => {
  const digitsReverse: number[] = [];

  for (let i = 0; i < DISPLAY_LENGTH; i++) {
    const digit = value % 10;
    digitsReverse.push(digit);
    value = (value - digit) / 10;
  }

  return digitsReverse.reverse();
};

// displays positive number
const Display = ({ value }: Props) => {
  const digits = getDigits(value);

  return (
    <div className={"display"}>
      {digits.map((digit, index) => (
        <div
          className={classNames("display__cell", `display__digit-${digit}`)}
          key={index}
        ></div>
      ))}
    </div>
  );
};

export default Display;
