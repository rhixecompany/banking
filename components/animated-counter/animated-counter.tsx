"use client";

import { JSX } from "react";
import CountUp from "react-countup";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {{ amount: number }} param0
 * @param {number} param0.amount
 * @returns {JSX.Element}
 */
const AnimatedCounter = ({ amount }: { amount: number }): JSX.Element => {
  return (
    <div className="w-full">
      <CountUp decimals={2} decimal="," prefix="$" end={amount} />
    </div>
  );
};

export default AnimatedCounter;
