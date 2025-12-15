"use client"

import * as React from "react"
import { useTranslation } from "react-i18next";
import {Bar, BarChart, CartesianGrid, Rectangle, XAxis} from "recharts"
import { Activity } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx" // Assuming .tsx is correct for your project
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart" // Assuming this component exists

// --- Data Structure and Configuration ---

// Define the structure for a single data point (e.g., one hour)
type ActivityStatus = "success" | "warning" | "error";

interface ActivityData {
  time: string; // E.g., "10:00"
  count: number; // The number of activities/events in this hour
  status: ActivityStatus; // The highest severity status in this hour
}

// Helper to generate 24 hours of placeholder data
const generateLast24HoursData = (): ActivityData[] => {
  const now = new Date();
  const data: ActivityData[] = [];

  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourString = hour.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false });

    // Simple logic to inject different statuses for demonstration
    let status: ActivityStatus = "success";
    let count = Math.floor(Math.random() * 50) + 20;

    if (i === 1 || i === 12) {
      status = "error";
      count = Math.floor(Math.random() * 100) + 50;
    } else if (i === 5 || i === 18) {
      status = "warning";
      count = Math.floor(Math.random() * 70) + 30;
    }

    data.push({ time: hourString, count, status });
  }

  return data;
};

const chartData: ActivityData[] = generateLast24HoursData();

// Define chart colors for the statuses
const chartConfig = {
  count: {
    label: "Activities",
  },
  // Define colors for the bar fill
  success: {
    label: "Success",
    color: "oklch(43.9% 0 0)", // A shade of green
  },
  warning: {
    label: "Warning",
    color: "oklch(76.9% 0.188 70.08)", // A shade of yellow/orange
  },
  error: {
    label: "Error",
    color: "oklch(64.5% 0.246 16.439)", // A shade of red
  },
} satisfies ChartConfig;

// --- Component ---

export default function OverviewActivityBox() {
  const { t } = useTranslation();

  // State to hold the active bar's status for dynamic color calculation
  const [activeBarStatus, setActiveBarStatus] = React.useState<ActivityStatus>("success");

  // Custom function to get the fill color based on the status
  const getBarFillColor = (data: ActivityData): string => {
    return chartConfig[data.status].color;
  };

  const CustomBarShape = (props: any) => {
    const { x, y, width, height, payload } = props;

    // Use your logic to get the color based on payload
    const fillColor = getBarFillColor(payload as ActivityData);

    return (
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
        opacity={0.9}
        radius={4}
      />
    );
  };

  return (
    <Card className="w-full col-span-2">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Activity size={18} className="-translate-y-0.5"/>
          {t("panel.page.overview.activity.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto w-full h-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, left: 10, right: 10, bottom: 0 }}
            onMouseMove={(state) => {
              if (state.activePayload && state.activePayload.length) {
                const dataPoint = state.activePayload[0].payload as ActivityData;
                setActiveBarStatus(dataPoint.status);
              }
            }}
            onMouseLeave={() => {
              setActiveBarStatus("success");
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value, index) => {
                if (index % 4 === 0) {
                  return value;
                }
                return "";
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="count"
                  formatter={(value, _name, props) => {
                    const dataPoint = props.payload as ActivityData;
                    const statusLabel = chartConfig[dataPoint.status].label;
                    return [value, ` ${statusLabel} Activities`];
                  }}
                  labelFormatter={(value) => `Time: ${value}`}
                />
              }
            />
            <Bar
              dataKey="count"
              shape={CustomBarShape}
              radius={4}
              activeBar={{
                fill: chartConfig[activeBarStatus].color,
                opacity: 0.8,
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}