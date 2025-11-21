import {useEffect, useState} from "react";
import {type ColumnDef} from "@tanstack/react-table";
import {DataTable} from "@/components/table";
import {Badge} from "@/components/ui/badge";
import PanelPage from "@/layouts/panel";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import {
  Edit2,
  MoreHorizontal,
  PlusIcon, Power,
  RefreshCcw,
  Trash2
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip.tsx";
import {cn} from "@/lib/utils"
import {Progress} from "@/components/ui/progress.tsx";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";

export type KubernetesNode = {
  name: string;
  cpuCores: number;
  cpuUsage: number;
  memory: number;
  memoryUsage: number;
  storage: number;
  storageUsage: number;
  version: string;
  status: "Ready" | "NotReady" | "SchedulingDisabled";
};

const dummyNodes: KubernetesNode[] = [
  {
    name: "node-1",
    cpuCores: 4,
    cpuUsage: 60,
    memory: 16,
    memoryUsage: 40,
    storage: 200,
    storageUsage: 70,
    version: "v1.29.3",
    status: "Ready",
  },
  {
    name: "node-2",
    cpuCores: 8,
    cpuUsage: 30,
    memory: 32,
    memoryUsage: 50,
    storage: 500,
    storageUsage: 25,
    version: "v1.29.3",
    status: "Ready",
  },
  {
    name: "node-3",
    cpuCores: 2,
    cpuUsage: 80,
    memory: 8,
    memoryUsage: 90,
    storage: 100,
    storageUsage: 60,
    version: "v1.28.1",
    status: "NotReady",
  },
];

export const nodeColumns: ColumnDef<KubernetesNode, unknown>[] = [
  {
    header: "Name",
    accessorKey: "name",
    enableSorting: true,
  },
  {
    header: "CPU",
    accessorKey: "cpuCores",
    enableSorting: true,
    cell: ({ row }) => {
      const cores = row.getValue("cpuCores") as number;
      const usage = row.original.cpuUsage;
      return (
        <div className="flex items-center gap-5">
          <Progress value={usage} className="[&>div]:bg-sky-400" />
          <span>{cores} Cores</span>
        </div>
      );
    },
  },
  {
    header: "Memory",
    accessorKey: "memory",
    enableSorting: true,
    cell: ({ row }) => {
      const memory = row.getValue("memory") as string;
      const usage = row.original.memoryUsage;
      return (
        <div className="flex items-center gap-5">
          <Progress value={usage} className="[&>div]:bg-emerald-400" />
          <span>{memory} GB</span>
        </div>
      );
    },
  },
  {
    header: "Storage",
    accessorKey: "storage",
    enableSorting: true,
    cell: ({ row }) => {
      const storage = row.getValue("storage") as string;
      const usage = row.original.storageUsage;
      return (
        <div className="flex items-center gap-5">
          <Progress value={usage} className="[&>div]:bg-fuchsia-400" />
          <span>{storage} GB</span>
        </div>
      );
    },
  },
  {
    header: "Version",
    accessorKey: "version",
    enableSorting: true,
    maxSize: 100,
  },
  {
    header: "Status",
    accessorKey: "status",
    enableSorting: true,
    maxSize: 120,
    cell: ({ row }) => {
      const value = row.getValue("status") as KubernetesNode["status"];
      const colors = {
        Ready: "bg-green-600/10 text-green-600",
        NotReady: "bg-red-600/10 text-red-600",
        SchedulingDisabled: "bg-amber-600/10 text-amber-600",
      };
      return <Badge className={cn("px-4 py-2 -my-2", colors[value])}>{value}</Badge>;
    },
  },
  {
    id: "actions",
    header: "",
    maxSize: 60,
    cell: () => {
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-fit">
                <MoreHorizontal/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => {}}
                className="flex items-center gap-2"
              >
                <Edit2 size={16} /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {}}
                className="flex items-center gap-2"
              >
                <RefreshCcw size={16} /> Restart
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {}}
                className="flex items-center gap-2"
              >
                <Power size={16} /> Drain
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {}}
                className="text-red-600 flex items-center gap-2"
              >
                <Trash2 className="text-red-600" size={16} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default function NodesPage() {
  const {t} = useTranslation();
  const [nodes] = useState(dummyNodes);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <PanelPage title="panel.page.nodes.title">
      <div className="flex items-center justify-end mb-[4vh]">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size='lg'
                    className='bg-primary'
            >
              <PlusIcon/>
              {t("panel.page.nodes.add")}
            </Button>
          </TooltipTrigger>
          <TooltipContent className='max-w-64 text-pretty'>
            <div className='flex items-center gap-1.5'>
              <p>{t("coming.soon")}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <DataTable<KubernetesNode>
        columns={nodeColumns}
        data={nodes}
        pageSize={5}
        initialSorting={[{id: "name", desc: false}]}
        isLoading={isLoading}
      />
    </PanelPage>
  )
}
