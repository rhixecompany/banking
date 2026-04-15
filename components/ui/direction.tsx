"use client";

import { Direction } from "radix-ui";
import * as React from "react";

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

const useDirection = Direction.useDirection;

export { DirectionProvider, useDirection };
