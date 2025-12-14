"use client"

import * as React from "react"
import {Label, Pie, PieChart} from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import podService from "@/api/services/pod-service"
import {useTranslation} from "react-i18next"
import {Scale} from "lucide-react";

export function OverviewDistributionBox() {
  const {t} = useTranslation()
  const [chartData, setChartData] = React.useState<
    { node: string; pods: number; fill: string }[]
  >([])

  const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
  ]

  const chartConfig = React.useMemo(
    () =>
      chartData.reduce((acc, curr) => {
        acc[curr.node] = {label: curr.node, color: curr.fill}
        return acc
      }, {} as ChartConfig),
    [chartData]
  )

  React.useEffect(() => {
    async function fetchPods() {
      const res = await podService.list()
      const pods = res?.pods ?? []

      const podsPerNode = pods.reduce<Record<string, number>>((acc, pod) => {
        acc[pod.node] = (acc[pod.node] ?? 0) + 1
        return acc
      }, {})

      const data = Object.entries(podsPerNode).map(([node, pods], i) => ({
        node,
        pods,
        fill: COLORS[i % COLORS.length],
      }))

      setChartData(data)
    }

    fetchPods()
    const id = setInterval(fetchPods, 5000) // refresh every 5s
    return () => clearInterval(id)
  }, [])

  const totalPods = React.useMemo(
    () => chartData.reduce((sum, d) => sum + d.pods, 0),
    [chartData]
  )

  return (
    <div className="bg-muted/50 aspect-video rounded-xl overflow-hidden">
      <div className="flex flex-col h-full p-6 pb-4">
        <span className="flex items-center gap-3 text-lg font-semibold">
          <Scale size={18}/> {t("panel.page.overview.distribution.title")}
        </span>
        <div className="flex-1 min-h-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] -mt-5"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel/>}
              />
              <Pie
                data={chartData}
                dataKey="pods"
                nameKey="node"
                innerRadius={75}
                strokeWidth={5}
              >
                <Label
                  content={({viewBox}) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalPods}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {t("panel.page.overview.distribution.pods")}
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}
