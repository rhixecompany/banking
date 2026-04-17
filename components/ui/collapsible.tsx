"use client";

import { Collapsible as CollapsiblePrimitive } from "radix-ui";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof CollapsiblePrimitive.Root>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
