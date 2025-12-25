import {Gauge} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {Node} from "@/api/services/node-service.ts";

export default function NodeOverviewCapacity(
  {
    node
  }: {
    node: Node | null
  }
) {
  const {t} = useTranslation();
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center gap-3 text-xl mb-5">
        <Gauge size={20}/> {t("panel.page.node.overview.capacity.title")}
      </span>
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.node.overview.capacity.cpu")}</span>
          {node &&
            <span>{node.allocated_cpu_capacity}m ({(node.allocated_cpu_capacity / node.total_cpu_capacity * 100).toFixed(0)}%)</span>
          }
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.node.overview.capacity.memory")}</span>
          {node &&
            <span>{(node.allocated_memory_capacity / 1024 / 1024).toFixed(0)}Mi ({(node.allocated_memory_capacity / node.total_memory_capacity * 100).toFixed(0)}%)</span>
          }
        </div>
      </div>
    </div>
  );
}