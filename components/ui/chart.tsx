"use client";

import type { TooltipValueType } from "recharts";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{ readonly dark: ".dark"; readonly light: ""; }}
 */
const THEMES = { dark: ".dark", light: "" } as const;

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{ readonly height: 200; readonly width: 320; }}
 */
const INITIAL_DIMENSION = { height: 200, width: 320 } as const;
/**
 * Description placeholder
 * @author Adminbot
 *
 * @typedef {TooltipNameType}
 */
type TooltipNameType = number | string;

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {ChartConfig}
 */
export type ChartConfig = Record<
  string,
  (
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
    | { color?: string; theme?: never }
  ) & {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  }
>;

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface ChartContextProps
 * @typedef {ChartContextProps}
 */
interface ChartContextProps {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {ChartConfig}
   */
  config: ChartConfig;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const ChartContext = React.createContext<ChartContextProps | null>(null);

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {*}
 */
function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {{
 *   config: ChartConfig;
 *   children: React.ComponentProps<
 *     typeof RechartsPrimitive.ResponsiveContainer
 *   >["children"];
 *   initialDimension?: {
 *     width: number;
 *     height: number;
 *   };
 * } & React.ComponentProps<"div">} param0
 * @param {*} param0.children
 * @param {*} param0.className
 * @param {*} param0.config
 * @param {*} param0.id
 * @param {*} [param0.initialDimension=INITIAL_DIMENSION]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function ChartContainer({
  children,
  className,
  config,
  id,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
  initialDimension?: {
    width: number;
    height: number;
  };
} & React.ComponentProps<"div">) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replaceAll(":", "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {{ id: string; config: ChartConfig }} param0
 * @param {(Record<string, ({ color?: never; theme: Record<"dark" | "light", string>; } | { color?: string; theme?: never; }) & { label?: React.ReactNode; icon?: React.ComponentType; }>)} param0.config
 * @param {string} param0.id
 * @returns {*}
 */
const ChartStyle = ({ config, id }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const ChartTooltip = RechartsPrimitive.Tooltip;

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {{
 *   hideLabel?: boolean;
 *   hideIndicator?: boolean;
 *   indicator?: "dashed" | "dot" | "line";
 *   nameKey?: string;
 *   labelKey?: string;
 * } & Omit<
 *   RechartsPrimitive.DefaultTooltipContentProps<
 *     TooltipValueType,
 *     TooltipNameType
 *   >,
 *   "accessibilityLayer"
 * > &
 *   React.ComponentProps<"div"> &
 *   React.ComponentProps<typeof RechartsPrimitive.Tooltip>} param0
 * @param {*} param0.active
 * @param {*} param0.className
 * @param {*} param0.color
 * @param {*} param0.formatter
 * @param {*} [param0.hideIndicator=false]
 * @param {*} [param0.hideLabel=false]
 * @param {*} [param0.indicator="dot"]
 * @param {*} param0.label
 * @param {*} param0.labelClassName
 * @param {*} param0.labelFormatter
 * @param {*} param0.labelKey
 * @param {*} param0.nameKey
 * @param {*} param0.payload
 * @returns {*}
 */
function ChartTooltipContent({
  active,
  className,
  color,
  formatter,
  hideIndicator = false,
  hideLabel = false,
  indicator = "dot",
  label,
  labelClassName,
  labelFormatter,
  labelKey,
  nameKey,
  payload,
}: {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "dashed" | "dot" | "line";
  nameKey?: string;
  labelKey?: string;
} & Omit<
  RechartsPrimitive.DefaultTooltipContentProps<
    TooltipValueType,
    TooltipNameType
  >,
  "accessibilityLayer"
> &
  React.ComponentProps<"div"> &
  React.ComponentProps<typeof RechartsPrimitive.Tooltip>) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color ?? item.payload?.fill ?? item.color;

            return (
              <div
                key={index}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5  [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "my-0.5": nestLabel && indicator === "dashed",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "w-1": indicator === "line",
                            },
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center",
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value !== null && item.value !== undefined && (
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const ChartLegend = RechartsPrimitive.Legend;

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {{
 *   hideIcon?: boolean;
 *   nameKey?: string;
 * } & React.ComponentProps<"div"> &
 *   RechartsPrimitive.DefaultLegendContentProps} param0
 * @param {*} param0.className
 * @param {*} [param0.hideIcon=false]
 * @param {*} param0.nameKey
 * @param {*} param0.payload
 * @param {*} [param0.verticalAlign="bottom"]
 * @returns {*}
 */
function ChartLegendContent({
  className,
  hideIcon = false,
  nameKey,
  payload,
  verticalAlign = "bottom",
}: {
  hideIcon?: boolean;
  nameKey?: string;
} & React.ComponentProps<"div"> &
  RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:size-3  [&>svg]:text-muted-foreground",
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="size-2  shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}

// Helper to extract item config from a payload.
/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {ChartConfig} config
 * @param {unknown} payload
 * @param {string} key
 * @returns {*}
 */
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
