"use client";

import { JSX } from "react";
import CountUp from "react-countup";

/**
 * Description placeholder
 *
 * @param {{ amount: number }} param0
 * @param {number} param0.amount
 * @returns {*}
 */

const AnimatedCounter = ({ amount }: { amount: number }): JSX.Element => {
  return (
    <div className="w-full">
      <CountUp
        // duration={4}
        decimals={2}
        decimal=","
        prefix="$"
        end={amount}
      />
    </div>
  );
};

export default AnimatedCounter;
