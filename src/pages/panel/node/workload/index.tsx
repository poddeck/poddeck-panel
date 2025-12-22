import PanelPage from "@/layouts/panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import WorkloadContent from "@/pages/panel/workload/workload-content.tsx";
import useNode from "@/hooks/use-node.ts";
import NodePageBreadcrumb from "@/pages/panel/node/breadcrumb.tsx";
import NodePageHeader from "@/pages/panel/node/header.tsx";

export default function NodeWorkloadPage() {
  const {t} = useTranslation();
  const node = useNode();
  const [timeRange, setTimeRange] = useState(
    () => localStorage.getItem("workload_range") || "hour"
  );
  useEffect(() => {
    if (timeRange) {
      localStorage.setItem("workload_range", timeRange);
    }
  }, [timeRange]);
  return (
    <PanelPage breadcrumb={NodePageBreadcrumb()} layout={false}>
      <NodePageHeader node={node} page="workload"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex items-center justify-end">
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
        {node &&
          <WorkloadContent selectedNode={node?.name} timeRange={timeRange}/>
        }
      </div>
    </PanelPage>
  );
}
