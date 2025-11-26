import {type ColumnDef, type Row} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal, Trash2} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {type Pod} from "@/api/services/pod-service"
import {t} from "@/locales/i18n";
import {Badge} from "@/components/ui/badge.tsx";

export function PodsActionDropdown({row}: { row: Row<Pod> }) {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-fit hover:bg-black/10 dark:hover:bg-white/10 py-2 -my-2 rounded-full">
            <MoreHorizontal/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuSeparator/>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => {}}
            className="text-rose-600 flex items-center gap-2"
            variant='destructive'
          >
            <Trash2 className="text-rose-600"
                    size={16}/> {t("panel.page.pods.action.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function PodsStatus({status}: {status: string}) {
  if (status === "pending") {
    return <Badge
      className="px-4 py-2 -my-2 bg-yellow-600/10 text-yellow-600">
      {t("panel.page.pods.status.pending")}
    </Badge>;
  } else if (status === "running") {
    return <Badge
      className="px-4 py-2 -my-2 bg-green-600/10 text-green-600">
      {t("panel.page.pods.status.running")}
    </Badge>;
  } else if (status === "succeeded") {
    return <Badge
      className="px-4 py-2 -my-2 bg-lime-600/10 text-lime-600">
      {t("panel.page.pods.status.succeeded")}
    </Badge>;
  } else if (status === "failed") {
    return <Badge
      className="px-4 py-2 -my-2 bg-red-600/10 text-red-600">
      {t("panel.page.pods.status.failed")}
    </Badge>;
  } else if (status === "unknown") {
    return <Badge
      className="px-4 py-2 -my-2 bg-zinc-400/10 text-zinc-400">
      {t("panel.page.pods.status.unknown")}
    </Badge>;
  }
}

export function PodsAge({age}: { age: number }) {
  function convertTime(age: number) {
    const abs = Math.abs(age);
    if (abs < 1000 * 60) {
      return Math.round(age / 1000) + "s";
    }
    if (abs < 1000 * 60 * 60) {
      return Math.round(age / (1000 * 60)) + "m";
    }
    if (abs < 1000 * 60 * 60 * 24) {
      return Math.round(age / (1000 * 60 * 60)) + "h";
    }
    return Math.round(age / (1000 * 60 * 60 * 24)) + "d";
  }
  return (
    <span>{convertTime(age)}</span>
  );
}

export const columns: ColumnDef<Pod, unknown>[] = [
  {
    header: "panel.page.pods.column.namespace",
    accessorKey: "namespace"
  },
  {
    header: "panel.page.pods.column.name",
    accessorKey: "name",
  },
  {
    header: "panel.page.pods.column.containers",
    accessorKey: "container",
    cell: ({row}) => {
      return (
        <span>{row.original.ready_containers} / {row.original.total_containers}</span>
      );
    },
  },
  {
    header: "panel.page.pods.column.status",
    accessorKey: "status",
    cell: ({row}) => {
      return <PodsStatus status={row.original.status.toLowerCase()}/>
    },
  },
  {
    header: "panel.page.pods.column.restarts",
    accessorKey: "restarts",
  },
  {
    header: "panel.page.pods.column.age",
    accessorKey: "age",
    cell: ({row}) => {
      return <PodsAge age={row.original.age}/>
    },
  },
  {
    header: "panel.page.pods.column.node",
    accessorKey: "node",
  },
  {
    header: "panel.page.pods.column.ip",
    accessorKey: "ip",
  },
  {
    id: "actions",
    header: "",
    maxSize: 60,
    enableHiding: false,
    cell: ({row}) => {
      return <PodsActionDropdown row={row}/>
    },
  },
];