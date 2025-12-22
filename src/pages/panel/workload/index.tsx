import PanelPage from "@/layouts/panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {useEffect, useState} from "react";
import nodeService, {type Node} from "@/api/services/node-service.ts";
import {useTranslation} from "react-i18next";
import {useSearchParams} from "react-router-dom";
import WorkloadContent from "@/pages/panel/workload/workload-content.tsx";

export default function WorkloadPage() {
  const {t} = useTranslation();
  const [timeRange, setTimeRange] = useState(
    () => localStorage.getItem("workload_range") || "hour"
  );
  const [selectedNode, setSelectedNode] = useState<string>(
    () => localStorage.getItem("workload_node") || ""
  );
  const [nodes, setNodes] = useState<Node[]>([]);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    async function loadNodes() {
      const response = await nodeService.list();
      setNodes(response.nodes);
      const nodeFromQuery = searchParams.get("node");
      const nodeExists = response.nodes.some(n => n.name === nodeFromQuery);
      if (nodeExists) {
        setSelectedNode(nodeFromQuery!);
      } else if (response.nodes.length > 0) {
        setSelectedNode(response.nodes[0].name);
      }
    }
    loadNodes();
  }, [searchParams]);
  useEffect(() => {
    if (selectedNode) {
      localStorage.setItem("workload_node", selectedNode);
    }
  }, [selectedNode]);
  useEffect(() => {
    if (timeRange) {
      localStorage.setItem("workload_range", timeRange);
    }
  }, [timeRange]);
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
                  {t("panel.page.workload.nodes.empty")}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px] rounded-lg">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="minute" className="rounded-lg">{t("panel.page.workload.range.minute")}</SelectItem>
              <SelectItem value="hour" className="rounded-lg">{t("panel.page.workload.range.hour")}</SelectItem>
              <SelectItem value="day" className="rounded-lg">{t("panel.page.workload.range.day")}</SelectItem>
              <SelectItem value="week" className="rounded-lg">{t("panel.page.workload.range.week")}</SelectItem>
              <SelectItem value="month" className="rounded-lg">{t("panel.page.workload.range.month")}</SelectItem>
              <SelectItem value="year" className="rounded-lg">{t("panel.page.workload.range.year")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <WorkloadContent selectedNode={selectedNode} timeRange={timeRange}/>
      </div>
    </PanelPage>
  );
}
