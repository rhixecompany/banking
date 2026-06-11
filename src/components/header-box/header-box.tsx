import type { HeaderBoxProps } from "@/types";

import { Card, CardContent } from "@/components/ui/card";

/**
 * HeaderBox displays a page section header with title and optional subtext.
 * Supports greeting mode for personalized user headers.
 * Supports actions slot for buttons displayed on the right side.
 *
 * @description
 * Renders a styled page header with a main title and optional subtitle text.
 * When type is "greeting", displays a personalized welcome message with the user's name.
 * Uses a gradient text effect for the name in greeting mode.
 * Includes an optional actions slot for buttons or other interactive elements.
 *
 * @example
 * ```tsx
 * // Simple title header
 * <HeaderBox
 *   title="Transaction History"
 *   subtext="View all your transactions"
 * />
 *
 * // Personalized greeting with actions
 * <HeaderBox
 *   type="greeting"
 *   title="Welcome back,"
 *   user="John"
 *   subtext="Here's your financial overview"
 *   actions={<Button>Add Wallet</Button>}
 * />
 * ```
 *
 * @param props - Component props
 * @param props.subtext - Descriptive text displayed below the title
 * @param props.title - Main header text
 * @param props.type - Header style mode: "title" for plain, "greeting" for personalized
 * @param props.user - User's first name for greeting mode
 * @param props.actions - Optional action elements (e.g., buttons) displayed on the right
 * @returns Rendered header box component
 */
const HeaderBox = ({
  actions,
  subtext,
  title,
  type = "title",
  user,
}: HeaderBoxProps): JSX.Element => {
  return (
    <Card className="header-box border-none bg-transparent shadow-none">
      <CardContent className="header-box-row flex flex-row items-center justify-between p-0">
        <div className="flex flex-col gap-1">
          <h1 className="header-box-title">
            {title}
            {type === "greeting" && (
              <span className="text-bankGradient">&nbsp;{user}</span>
            )}
          </h1>
          {subtext && <p className="header-box-subtext">{subtext}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardContent>
    </Card>
  );
};

export default HeaderBox;
