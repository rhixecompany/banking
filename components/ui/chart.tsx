"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
/**
 * Description placeholder
 *
 * @type {{ readonly light: ""; readonly dark: ".dark"; }}
 */
const THEMES = { dark: ".dark", light: "" } as const;

/**
 * Description placeholder
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
 *
 * @typedef {ChartContextProps}
 */
interface ChartContextProps {
  /**
   * Description placeholder
   *
   * @type {ChartConfig}
   */
  config: ChartConfig;
}

/**
 * Description placeholder
 *
 * @type {*}
 */
const ChartContext = React.createContext<ChartContextProps | undefined>(
  undefined,
);

/**
 * Description placeholder
 *
 * @returns {*}
 */
function useChart(): ChartContextProps {
  const context = React.useContext(ChartContext);

  if (context === undefined) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

/**
 * Description placeholder
 *
 * @type {*}
 */
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  } & React.ComponentProps<"div">
>(({ children, className, config, id, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replaceAll(":", "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-none [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

/**
 * Description placeholder
 *
 * @param {{ id: string; config: ChartConfig }} param0
 * @param {string} param0.id
 * @param {ChartConfig} param0.config
 * @returns {*}
 */
const ChartStyle = ({ config, id }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color,
  );

  if (!colorConfig.length) {
    return undefined;
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
    return color ? `  --color-${key}: ${color};` : undefined;
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
 *
 * @type {*}
 */
const ChartTooltip = RechartsPrimitive.Tooltip;

/**
 * Description placeholder
 *
 * @type {*}
 */
const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "dashed" | "dot" | "line";
    nameKey?: string;
    labelKey?: string;
  } & React.ComponentProps<"div"> &
    React.ComponentProps<typeof RechartsPrimitive.Tooltip>
>(
  (
    {
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
    },
    ref,
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return undefined;
      }

      const [item] = payload;
      const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? (config[label as keyof typeof config]?.label ?? label)
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return undefined;
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
      return undefined;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : undefined}
        <div className="grid gap-1.5">
          {payload
            .filter((item) => item.type !== "none")
            .map((item, index) => {
              const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
              const itemConfig = getPayloadConfigFromPayload(config, item, key);
              const indicatorColor = color ?? item.payload.fill ?? item.color;

              return (
                <div
                  key={item.dataKey}
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
                              "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
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
                          {nestLabel ? tooltipLabel : undefined}
                          <span className="text-muted-foreground">
                            {itemConfig?.label ?? item.name}
                          </span>
                        </div>
                        {item.value && (
                          <span className="font-mono font-medium text-foreground tabular-nums">
                            {item.value.toLocaleString()}
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
  },
);
ChartTooltipContent.displayName = "ChartTooltip";

/**
 * Description placeholder
 *
 * @type {*}
 */
const ChartLegend = RechartsPrimitive.Legend;

/**
 * Description placeholder
 *
 * @type {*}
 */
const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  {
    hideIcon?: boolean;
    nameKey?: string;
  } & Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> &
    React.ComponentProps<"div">
>(
  (
    { className, hideIcon = false, nameKey, payload, verticalAlign = "bottom" },
    ref,
  ) => {
    const { config } = useChart();

    if (!payload?.length) {
      return undefined;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className,
        )}
      >
        {payload
          .filter((item) => item.type !== "none")
          .map((item) => {
            const key = `${nameKey ?? item.dataKey ?? "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);

            return (
              <div
                key={item.value}
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
  },
);
ChartLegendContent.displayName = "ChartLegend";

// Helper to extract item config from a payload.
/**
 * Description placeholder
 *
 * @param {ChartConfig} config
 * @param {unknown} payload
 * @param {string} key
 * @returns {({ label?: React.ReactNode; icon?: React.ComponentType; } & ({ color?: string; theme?: never; } | { color?: never; theme: Record<"light" | "dark", string>; }))}
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

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
