"use client";

import { JSX } from "react";
import CountUp from "react-countup";

/**
 * AnimatedCounter displays a numeric value with a smooth counting animation.
 * Uses react-countup to animate the number from 0 to the target amount.
 *
 * @description
 * This component renders a currency-formatted counter with automatic animation.
 * The counter animates from 0 to the specified amount over a configurable duration.
 * It displays the value with a dollar prefix and two decimal places.
 *
 * @example
 * ```tsx
 * <AnimatedCounter amount={1234.56} />
 * // Renders: $1,234.56 with counting animation
 * ```
 *
 * @param props - Component props
 * @param props.amount - The final numeric value to display
 * @returns Rendered counter with $ prefix and 2 decimal places
 */
const AnimatedCounter = ({ amount }: { amount: number }): JSX.Element => {
  return (
    <div className="w-full">
      <CountUp decimals={2} decimal="," prefix="$" end={amount} />
    </div>
  );
};

export default AnimatedCounter;
