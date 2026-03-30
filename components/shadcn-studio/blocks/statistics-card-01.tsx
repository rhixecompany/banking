import type { ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Statistics card data type
/**
 * Description placeholder
 *
 * @typedef {StatisticsCardProps}
 */
interface StatisticsCardProps {
  /**
   * Description placeholder
   *
   * @type {ReactNode}
   */
  icon: ReactNode;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  value: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  title: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  changePercentage: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  className?: string;
}

/**
 * Description placeholder
 *
 * @param {StatisticsCardProps} param0
 * @param {ReactNode} param0.icon
 * @param {string} param0.value
 * @param {string} param0.title
 * @param {string} param0.changePercentage
 * @param {string} param0.className
 * @returns {*}
 */
const StatisticsCard = ({
  changePercentage,
  className,
  icon,
  title,
  value,
}: StatisticsCardProps): JSX.Element => {
  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader className="flex items-center">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="text-2xl">{value}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <span className="font-semibold">{title}</span>
        <p className="space-x-2 rtl:space-x-reverse">
          <span className="text-sm">{changePercentage}</span>
          <span className="text-sm text-muted-foreground">than last week</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
