import {WorkloadChart} from "@/pages/panel/workload/workload-chart.tsx";
import {useEffect, useMemo, useRef, useState} from "react";
import workloadService, {
  type Metric,
  type WorkloadRequest
} from "@/api/services/workload-service.ts";
import {useTranslation} from "react-i18next";

const RANGE_MAP: Record<string, { ms: number; accuracy: string }> = {
  "minute": { ms: 1 * 60 * 1000, accuracy: "second" },
  "hour": { ms: 60 * 60 * 1000, accuracy: "minute" },
  "day": { ms: 24 * 60 * 60 * 1000, accuracy: "hour" },
  "week": { ms: 7 * 24 * 60 * 60 * 1000, accuracy: "day" },
  "month": { ms: 30 * 24 * 60 * 60 * 1000, accuracy: "day" },
  "year": { ms: 365 * 24 * 60 * 60 * 1000, accuracy: "month" },
};

export default function WorkloadContent(
  {
    selectedNode,
    timeRange
  }: {
    selectedNode: string;
    timeRange: string;
  }
) {
  const {t} = useTranslation();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const latestTimestampReference = useRef<number>(0);
  useEffect(() => {
    if (!selectedNode) {
      return;
    }
    async function loadMetrics() {
      const now = Date.now();
      const cfg = RANGE_MAP[timeRange] ?? RANGE_MAP["hour"];
      const start = now - cfg.ms;
      const request: WorkloadRequest = {
        node: selectedNode,
        start,
        end: now,
        accuracy: cfg.accuracy,
      };
      const response = await workloadService.find(request);
      setMetrics(response.workload);
      if (response.workload.length > 0) {
        latestTimestampReference.current =
          response.workload[response.workload.length - 1].timestamp;
      }
    }
    loadMetrics();
  }, [timeRange, selectedNode]);
  useEffect(() => {
    if (!selectedNode) {
      return;
    }
    const interval = setInterval(async () => {
      const now = Date.now();
      const cfg = RANGE_MAP[timeRange] ?? RANGE_MAP["hour"];
      const request: WorkloadRequest = {
        node: selectedNode,
        start: latestTimestampReference.current + 1,
        end: now,
        accuracy: cfg.accuracy,
      };
      const response = await workloadService.find(request);
      if (response.workload.length > 0) {
        const newEntry = response.workload[response.workload.length - 1];
        if (newEntry.timestamp !== latestTimestampReference.current) {
          setMetrics((prev) => {
            const updated = prev.slice(1);
            return [...updated, newEntry];
          });
          latestTimestampReference.current = newEntry.timestamp;
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedNode, timeRange]);
  const cpuData = useMemo(
    () => metrics.map((m) => ({ date: new Date(m.timestamp).toISOString(), data: m.cpu_ratio.toFixed(2) })),
    [metrics]
  );
  const memoryData = useMemo(
    () => metrics.map((m) => ({ date: new Date(m.timestamp).toISOString(), data: m.used_memory.toFixed(2) })),
    [metrics]
  );
  const storageData = useMemo(
    () => metrics.map((m) => ({ date: new Date(m.timestamp).toISOString(), data: m.used_storage.toFixed(2) })),
    [metrics]
  );
  const latestMetric = metrics[metrics.length - 1];
  const cpuUsage = latestMetric ? `${Math.round(latestMetric.cpu_ratio)}%` : "-";
  const memoryUsage = latestMetric
    ? `${Math.round((latestMetric.used_memory / latestMetric.total_memory) * 100)}%`
    : "-";
  const memoryRelation = latestMetric
    ? `(${latestMetric.used_memory.toFixed(1)} GB / ${latestMetric.total_memory.toFixed(1)} GB)`
    : "-";
  const storageUsage = latestMetric
    ? `${Math.round((latestMetric.used_storage / latestMetric.total_storage) * 100)}%`
    : "-";
  const storageRelation = latestMetric
    ? `(${latestMetric.used_storage.toFixed(1)} GB / ${latestMetric.total_storage.toFixed(1)} GB)`
    : "-";
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <WorkloadChart
        id="cpu"
        title={t("panel.page.workload.cpu")}
        usage={cpuUsage}
        color="oklch(0.75 0.14 233)"
        data={cpuData}
        unit={"%"}
        currentRange={RANGE_MAP[timeRange].accuracy}
      />
      <WorkloadChart
        id="memory"
        title={t("panel.page.workload.memory")}
        usage={memoryUsage}
        relation={memoryRelation}
        color="oklch(0.77 0.15 163)"
        data={memoryData}
        unit={"GB"}
        currentRange={RANGE_MAP[timeRange].accuracy}
      />
      <WorkloadChart
        id="storage"
        title={t("panel.page.workload.storage")}
        usage={storageUsage}
        relation={storageRelation}
        color="oklch(0.75 0.21 322)"
        data={storageData}
        unit={"GB"}
        currentRange={RANGE_MAP[timeRange].accuracy}
      />
    </div>
  );
}
