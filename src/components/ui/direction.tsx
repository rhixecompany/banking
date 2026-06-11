"use client";

import { Direction } from "radix-ui";
import * as React from "react";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {({
 *   direction?: React.ComponentProps<typeof Direction.DirectionProvider>["dir"];
 * } & React.ComponentProps<typeof Direction.DirectionProvider>)} param0
 * @param {*} param0.children
 * @param {*} param0.dir
 * @param {*} param0.direction
 * @returns {ReactJSX.Element}
 */
function DirectionProvider({
  children,
  dir,
  direction,
}: {
  direction?: React.ComponentProps<typeof Direction.DirectionProvider>["dir"];
} & React.ComponentProps<typeof Direction.DirectionProvider>) {
  return (
    <Direction.DirectionProvider dir={direction ?? dir}>
      {children}
    </Direction.DirectionProvider>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const useDirection = Direction.useDirection;

export { DirectionProvider, useDirection };
