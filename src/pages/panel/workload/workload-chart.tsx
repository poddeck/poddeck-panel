"use client"

import {Area, AreaChart, CartesianGrid, XAxis} from "recharts"

import {
  Card,
  CardContent, CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {useTranslation} from "react-i18next";

export interface WorkloadChartEntry {
  date: string | number | Date
  data: string
}

interface WorkloadChartProps {
  id: string
  title: string
  usage: string
  relation?: string
  color: string
  data: WorkloadChartEntry[]
  unit: string,
  currentRange: string
}

const getTickFormatter = (range: string, language: string) => {
  return (value: string | number) => {
    const date = new Date(value);
    switch (range) {
      case "second":
        return date.toLocaleTimeString(language, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      case "minute":
        return date.toLocaleTimeString(language, {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "hour":
        return date.toLocaleString(language, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
        });
      default:
        return date.toLocaleDateString(language, {
          month: "short",
          day: "numeric",
        });
    }
  };
};


export function WorkloadChart(
  {
    id,
    title,
    usage,
    relation,
    color,
    data,
    unit,
    currentRange
  }: WorkloadChartProps
) {
  const {i18n} = useTranslation();
  const language = (i18n.resolvedLanguage || "en_US").replace("_", "-");
  const gradientId = `fillData-${id.replace(/\s+/g, "")}`;
  const chartConfig = {
    data: {
      label: title,
      color: color,
    },
  } satisfies ChartConfig
  return (
    <Card className="pt-0">
      <CardHeader
        className="flex items-center justify-between space-y-0 border-b py-5 sm:flex-row">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          <CardTitle>{usage}</CardTitle>
          {relation &&
            <CardDescription className="pb-0.5">{relation}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false}/>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={getTickFormatter(currentRange, language)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString(language, {
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })
                  }}
                  formatter={(value, name) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                        style={
                          {
                            "--color-bg": `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label || name}
                      <div
                        className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                        {value}
                        <span
                          className="text-muted-foreground font-normal ml-1">
                          {unit}
                        </span>
                      </div>
                    </>
                  )}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="data"
              type="natural"
              fill={`url(#${gradientId})`}
              stroke={color}
              stackId="a"
              animationDuration={500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
