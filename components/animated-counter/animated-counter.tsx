"use client";

import { JSX } from "react";
import CountUp from "react-countup";

const AnimatedCounter = ({ amount }: { amount: number }): JSX.Element => {
  return (
    <div className="w-full">
      <CountUp decimals={2} decimal="," prefix="$" end={amount} />
    </div>
  );
};

export default AnimatedCounter;
