"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import { Activity } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import EventService, { type Event } from "@/api/services/event-service.ts";

type ActivityStatus = "success" | "warning" | "error";

interface ActivityData {
  time: string;
  count: number;
  status: ActivityStatus;
}

const chartConfig = {
  count: {
    label: "Activities",
  },
  success: {
    label: "Success",
    color: "oklch(43.9% 0 0)",
  },
  warning: {
    label: "Warning",
    color: "oklch(76.9% 0.188 70.08)",
  },
  error: {
    label: "Error",
    color: "oklch(64.5% 0.246 16.439)",
  },
} satisfies ChartConfig;

const HOURS = 24;

const getStatusPriority = (status: ActivityStatus) => {
  switch (status) {
    case "error":
      return 3;
    case "warning":
      return 2;
    default:
      return 1;
  }
};

const getEmpty24Hours = (): ActivityData[] => {
  const now = new Date();
  const data: ActivityData[] = [];

  for (let i = HOURS - 1; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
    hour.setMinutes(0, 0, 0);

    data.push({
      time: hour.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      count: 0,
      status: "success",
    });
  }

  return data;
};

const mapEventsToChartData = (events: Event[]): ActivityData[] => {
  const buckets = getEmpty24Hours();
  const now = Date.now();

  events.forEach((event) => {
    const diffHours = Math.floor(
      (now - event.last_timestamp) / (60 * 60 * 1000)
    );

    if (diffHours < 0 || diffHours >= HOURS) return;

    const index = HOURS - 1 - diffHours;
    const bucket = buckets[index];

    bucket.count += 1;

    let eventStatus: ActivityStatus = "success";
    if (event.type.toLowerCase() === "error") eventStatus = "error";
    else if (event.type.toLowerCase() === "warning") eventStatus = "warning";

    if (
      getStatusPriority(eventStatus) >
      getStatusPriority(bucket.status)
    ) {
      bucket.status = eventStatus;
    }
  });

  return buckets;
};

export default function OverviewActivityBox() {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<ActivityData[]>([]);
  const [activeBarStatus, setActiveBarStatus] =
    useState<ActivityStatus>("success");

  useEffect(() => {
    async function loadEvents() {
      const now = Date.now();
      const last24h = now - 24 * 60 * 60 * 1000;

      try {
        const response = await EventService.list({
          start: last24h,
          end: now,
          limit: 10000,
        });

        const aggregated = mapEventsToChartData(
          response.events as Event[]
        );

        setChartData(aggregated);
      } catch (err) {
        console.error("Failed to load events", err);
      }
    }

    loadEvents();

    const interval = setInterval(loadEvents, 1000);
    return () => clearInterval(interval);
  }, []);

  const getBarFillColor = (data: ActivityData) =>
    chartConfig[data.status].color;

  const CustomBarShape = (props: any) => {
    const { x, y, width, height, payload } = props;

    return (
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        radius={4}
        opacity={0.9}
        fill={getBarFillColor(payload as ActivityData)}
      />
    );
  };

  return (
    <Card className="w-full col-span-2">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Activity size={18} className="-translate-y-0.5" />
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
              if (state.activePayload?.length) {
                setActiveBarStatus(
                  state.activePayload[0].payload.status
                );
              }
            }}
            onMouseLeave={() => setActiveBarStatus("success")}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value, index) =>
                index % 4 === 0 ? value : ""
              }
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="count"
                  formatter={(value) => [value, " Events"]}
                  labelFormatter={(value) => `Zeit: ${value}`}
                />
              }
            />

            <Bar
              dataKey="count"
              shape={CustomBarShape}
              activeBar={{
                fill: chartConfig[activeBarStatus].color,
                opacity: 0.8,
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
