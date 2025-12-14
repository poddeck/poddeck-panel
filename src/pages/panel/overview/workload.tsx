"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { useTranslation } from "react-i18next";
import {
  Cpu,
  Gauge,
  MemoryStick,
  HardDrive,
  type LucideIcon
} from "lucide-react";

const CPU_COLOR = "#38bdf8";
const MEMORY_COLOR = "#34d399";
const STORAGE_COLOR = "#e879f9";

interface WorkloadRadialChartProps {
  label: string;
  color: string;
  percentage: number;
  Icon: LucideIcon;
}

const chartConfig = {
  percentage: {
    label: "Auslastung",
  },
  usage: {
    label: "Nutzung",
  },
};

const workloadData = {
  cpu: {
    labelKey: "CPU",
    percentage: 75.3,
    color: CPU_COLOR,
    Icon: Cpu,
  },
  memory: {
    labelKey: "Memory",
    percentage: 58.1,
    color: MEMORY_COLOR,
    Icon: MemoryStick,
  },
  storage: {
    labelKey: "Storage",
    percentage: 32.9,
    color: STORAGE_COLOR,
    Icon: HardDrive,
  },
};

export function WorkloadRadialChart({
                                      label,
                                      color,
                                      percentage,
                                      Icon,
                                    }: WorkloadRadialChartProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  const foregroundData = [
    { name: "usage", value: clampedPercentage, fill: color },
  ];

  const endAngle = 90 - (360 * (clampedPercentage / 100));

  return (
    <div className="flex flex-col items-center p-2">
      <ChartContainer
        config={chartConfig as ChartConfig}
        className="mx-auto aspect-square h-[200px] w-[200px]"
      >
        <RadialBarChart
          data={foregroundData}
          startAngle={90}
          endAngle={endAngle}
          innerRadius={80}
          outerRadius={110}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-card"
            polarRadius={[86, 74]}
          />

          <RadialBar
            dataKey="value"
            data={foregroundData}
            fill={color}
            opacity={0.9}
            endAngle={endAngle}
            cornerRadius={10}
          />

          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
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
                        className="fill-foreground/75 text-3xl font-semibold"
                      >
                        {clampedPercentage.toFixed(0)}%
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
      <span className="mt-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon size={16} className="inline" />
        {label}
      </span>
    </div>
  )
}

export default function OverviewWorkloadBox() {
  const { t } = useTranslation();

  return (
    <Card className="w-full col-span-3">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <Gauge size={18} className="-translate-y-0.5"/> {t("panel.page.overview.workload.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <div className="flex flex-col sm:flex-row gap-4 justify-around w-full">

          <WorkloadRadialChart
            label={t(workloadData.cpu.labelKey)}
            color={workloadData.cpu.color}
            percentage={workloadData.cpu.percentage}
            Icon={workloadData.cpu.Icon}
          />

          <WorkloadRadialChart
            label={t(workloadData.memory.labelKey)}
            color={workloadData.memory.color}
            percentage={workloadData.memory.percentage}
            Icon={workloadData.memory.Icon}
          />

          <WorkloadRadialChart
            label={t(workloadData.storage.labelKey)}
            color={workloadData.storage.color}
            percentage={workloadData.storage.percentage}
            Icon={workloadData.storage.Icon}
          />

        </div>
      </CardContent>
    </Card>
  )
}