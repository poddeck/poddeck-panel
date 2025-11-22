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

export function generateRandomChartData(startDate: string | number | Date, days: number) {
  const result = [];
  const current = new Date(startDate);

  for (let i = 0; i < days; i++) {
    result.push({
      date: current.toISOString().split("T")[0],
      data: Math.floor(Math.random() * 500) + 50, // random 50–550
    });

    current.setDate(current.getDate() + 1);
  }

  return result;
}

interface WorkloadChartProps {
  id: string
  title: string
  usage: string
  relation?: string
  color: string
  timeRange: string
}

export function WorkloadChart(
  {
    id,
    title,
    usage,
    relation,
    color,
    timeRange
  }: WorkloadChartProps
) {
  const {i18n} = useTranslation();
  const language = (i18n.resolvedLanguage || "en_US").replace("_", "-");
  const chartData = generateRandomChartData("2024-04-01", 90);
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })
  console.log(id);
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
          {relation && <CardDescription className="pb-0.5">{relation}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
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
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString(language, {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString(language, {
                      month: "short",
                      day: "numeric",
                    })
                  }}
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
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
