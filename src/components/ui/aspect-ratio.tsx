"use client";

import { AspectRatio as AspectRatioPrimitive } from "radix-ui";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof AspectRatioPrimitive.Root>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
