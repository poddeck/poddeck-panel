import {type ColumnDef, type Row} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button.tsx";
import {
  Cpu,
  Edit2,
  Gauge, HardDrive, type LucideIcon, MemoryStick,
  MoreHorizontal,
  Power,
  RefreshCcw,
  Trash2
} from "lucide-react";
import {Progress} from "@/components/ui/progress.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {type Node} from "@/api/services/node-service"
import {t} from "@/locales/i18n";
import {useRouter} from "@/routes/hooks";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import React from "react";

export function NodesActionDropdown({row}: { row: Row<Node> }) {
  const {replace} = useRouter();
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-fit hover:bg-black/10 dark:hover:bg-white/10 py-2 -my-2 rounded-full">
            <MoreHorizontal/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => {
            }}
            className="flex items-center gap-2"
          >
            <Edit2 size={16}/> {t("panel.page.nodes.action.edit")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              replace("/workload/?node=" + row.original.name);
            }}
            className="flex items-center gap-2"
          >
            <Gauge size={16}/> {t("panel.page.nodes.action.workload")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
            }}
            className="text-amber-600 flex items-center gap-2"
          >
            <RefreshCcw className="text-amber-600"
                        size={16}/> {t("panel.page.nodes.action.restart")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
            }}
            className="text-amber-600 flex items-center gap-2"
          >
            <Power className="text-amber-600"
                   size={16}/> {t("panel.page.nodes.action.drain")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
            }}
            className="text-rose-600 flex items-center gap-2"
          >
            <Trash2 className="text-rose-600"
                    size={16}/> {t("panel.page.nodes.action.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function NodesActionProgress(
  {color, label, icon, usage, value, unit}: {
    color: string,
    label: string,
    icon: LucideIcon,
    usage: number,
    value: number,
    unit: string
  }
) {
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div className="inline-block p-5 -m-5 w-full">
          <Progress value={usage} className={color} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className='w-fit -mt-4'>
        <div className='flex items-center gap-4'>
          <Avatar className="h-12 w-12 rounded-lg">
            <AvatarFallback className="rounded-lg">
              {React.createElement(icon, { className: "size-8" })}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-1'>
            <div
              className='text-sm font-medium'>{label}</div>
            <div className='text-xl font-semibold'>{value.toFixed(2)} {unit}</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export const columns: ColumnDef<Node, unknown>[] = [
  {
    header: "panel.page.nodes.column.name",
    accessorKey: "name",
    enableSorting: true,
  },
  {
    header: "panel.page.nodes.column.cpu",
    accessorKey: "cpu_cores",
    enableSorting: true,
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
    enableSorting: true,
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
    enableSorting: true,
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
    accessorKey: "version",
    enableSorting: true,
    maxSize: 100,
  },
  {
    header: "panel.page.nodes.column.status",
    accessorKey: "ready",
    enableSorting: true,
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
    cell: ({row}) => {
      return <NodesActionDropdown row={row}/>
    },
  },
];