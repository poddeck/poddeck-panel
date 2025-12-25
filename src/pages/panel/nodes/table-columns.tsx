import {type ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge";
import {Cpu, HardDrive, MemoryStick} from "lucide-react";
import {type Node} from "@/api/services/node-service"
import {t} from "@/locales/i18n";
import {NodesActionProgress, NodesActionDropdown} from "./table-components.tsx";

export const columns: ColumnDef<Node, unknown>[] = [
  {
    header: "panel.page.nodes.column.name",
    accessorKey: "name",
  },
  {
    header: "panel.page.nodes.column.cpu",
    accessorKey: "cpu_cores",
    cell: ({row}) => {
      const cores = row.original.cpu_cores;
      const usage = row.original.cpu_ratio;
      return (
        <div className="flex items-center gap-5">
          <NodesActionProgress
            color="[&>div]:bg-sky-400"
            label={t("panel.page.nodes.column.cpu")}
            icon={Cpu}
            usage={usage}
            value={usage}
            unit="%"
          />
          <span>{cores} {t("panel.page.nodes.cores")}</span>
        </div>
      );
    },
  },
  {
    header: "panel.page.nodes.column.memory",
    accessorKey: "total_memory",
    cell: ({row}) => {
      const memory = row.original.total_memory;
      const usage = row.original.memory_ratio;
      return (
        <div className="flex items-center gap-5">
          <NodesActionProgress
            color="[&>div]:bg-emerald-400"
            label={t("panel.page.nodes.column.memory")}
            icon={MemoryStick}
            usage={usage}
            value={row.original.used_memory}
            unit="GB"
          />
          <span>{memory.toFixed(2)} GB</span>
        </div>
      );
    },
  },
  {
    header: "panel.page.nodes.column.storage",
    accessorKey: "total_storage",
    cell: ({row}) => {
      const storage = row.original.total_storage;
      const usage = row.original.storage_ratio;
      return (
        <div className="flex items-center gap-5">
          <NodesActionProgress
            color="[&>div]:bg-fuchsia-400"
            label={t("panel.page.nodes.column.storage")}
            icon={HardDrive}
            usage={usage}
            value={row.original.used_storage}
            unit="GB"
          />
          <span>{storage.toFixed(2)} GB</span>
        </div>
      );
    },
  },
  {
    header: "panel.page.nodes.column.version",
    accessorKey: "kubelet_version",
    maxSize: 100,
  },
  {
    header: "panel.page.nodes.column.status",
    accessorKey: "ready",
    maxSize: 120,
    cell: ({row}) => {
      if (row.original.ready) {
        return <Badge
          className="px-4 py-2 -my-2 bg-green-600/10 text-green-600">
          {t("panel.page.nodes.status.ready")}
        </Badge>;
      } else {
        return <Badge className="px-4 py-2 -my-2 bg-rose-600/10 text-rose-600">
          {t("panel.page.nodes.status.not.ready")}
        </Badge>;
      }
    },
  },
  {
    id: "actions",
    header: "",
    maxSize: 60,
    enableHiding: false,
    cell: ({row}) => {
      return <NodesActionDropdown row={row}/>
    },
  },
];