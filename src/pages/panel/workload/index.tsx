import PanelPage from "@/layouts/panel";
import { WorkloadChart } from "@/pages/panel/workload/workload-chart.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {useEffect, useMemo, useRef, useState} from "react";
import workloadService, { type Metric, type WorkloadRequest } from "@/api/services/workload-service.ts";
import nodeService, { type Node } from "@/api/services/node-service.ts";

const RANGE_MAP: Record<string, { ms: number; accuracy: string }> = {
  "1m": { ms: 1 * 60 * 1000, accuracy: "second" },
  "1h": { ms: 60 * 60 * 1000, accuracy: "minute" },
  "1d": { ms: 24 * 60 * 60 * 1000, accuracy: "minute" },
  "7d": { ms: 7 * 24 * 60 * 60 * 1000, accuracy: "hour" },
  "30d": { ms: 30 * 24 * 60 * 60 * 1000, accuracy: "hour" },
  "90d": { ms: 90 * 24 * 60 * 60 * 1000, accuracy: "hour" },
};

export default function WorkloadPage() {
  const [timeRange, setTimeRange] = useState("1h");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<string>("");
  const latestTimestampReference = useRef<number>(0);
  useEffect(() => {
    async function loadNodes() {
      const response = await nodeService.list();
      setNodes(response.nodes);
      if (response.nodes.length > 0) {
        setSelectedNode(response.nodes[0].name);
      }
    }
    loadNodes();
  }, []);
  useEffect(() => {
    if (!selectedNode) {
      return;
    }
    async function loadMetrics() {
      const now = Date.now();
      const cfg = RANGE_MAP[timeRange] ?? RANGE_MAP["1h"];
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
      const cfg = RANGE_MAP[timeRange] ?? RANGE_MAP["1h"];
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
    <PanelPage title="panel.page.workload.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-between mb-[4vh]">
          <Select value={selectedNode} onValueChange={setSelectedNode}>
            <SelectTrigger className="w-[160px] rounded-lg">
              <SelectValue placeholder="Select Node" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {nodes && nodes.length > 0 ? (
                nodes.map((node) => (
                  <SelectItem key={node.name} value={node.name} className="rounded-lg">
                    {node.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled className="rounded-lg cursor-not-allowed text-gray-400">
                  No nodes available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px] rounded-lg">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1m" className="rounded-lg">Last 1 minute</SelectItem>
              <SelectItem value="1h" className="rounded-lg">Last 1 hour</SelectItem>
              <SelectItem value="1d" className="rounded-lg">Last 1 day</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
              <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <WorkloadChart
            id="cpu"
            title="CPU"
            usage={cpuUsage}
            color="oklch(0.75 0.14 233)"
            data={cpuData}
            unit={"%"}
          />
          <WorkloadChart
            id="memory"
            title="Memory"
            usage={memoryUsage}
            relation={memoryRelation}
            color="oklch(0.77 0.15 163)"
            data={memoryData}
            unit={"GB"}
          />
          <WorkloadChart
            id="storage"
            title="Storage"
            usage={storageUsage}
            relation={storageRelation}
            color="oklch(0.75 0.21 322)"
            data={storageData}
            unit={"GB"}
          />
        </div>
      </div>
    </PanelPage>
  );
}
