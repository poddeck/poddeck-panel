import {type ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button.tsx";
import {Edit2, MoreHorizontal, Power, RefreshCcw, Trash2} from "lucide-react";
import {cn} from "@/lib/utils"
import {Progress} from "@/components/ui/progress.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {type Node} from "@/api/services/node-service"

export const columns: ColumnDef<Node, unknown>[] = [
  {
    header: "Name",
    accessorKey: "name",
    enableSorting: true,
  },
  {
    header: "CPU",
    accessorKey: "cpu_cores",
    enableSorting: true,
    cell: ({ row }) => {
      const cores = row.original.cpu_cores;
      const usage = row.original.cpu_ratio;
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
    accessorKey: "total_memory",
    enableSorting: true,
    cell: ({ row }) => {
      const memory = row.original.total_memory;
      const usage = row.original.memory_ratio;
      return (
        <div className="flex items-center gap-5">
          <Progress value={usage} className="[&>div]:bg-emerald-400" />
          <span>{memory.toFixed(2)} GB</span>
        </div>
      );
    },
  },
  {
    header: "Storage",
    accessorKey: "total_storage",
    enableSorting: true,
    cell: ({ row }) => {
      const storage = row.original.total_storage;
      const usage = row.original.storage_ratio;
      return (
        <div className="flex items-center gap-5">
          <Progress value={usage} className="[&>div]:bg-fuchsia-400" />
          <span>{storage.toFixed(2)} GB</span>
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
    accessorKey: "ready",
    enableSorting: true,
    maxSize: 120,
    cell: ({ row }) => {
      const value = row.original.ready ? "Ready" : "NotReady";
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