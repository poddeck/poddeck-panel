import {type ColumnDef, type Row} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {type LucideIcon, MoreHorizontal, Trash2} from "lucide-react";
import {Progress} from "@/components/ui/progress.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {type Pod} from "@/api/services/pod-service"
import {t} from "@/locales/i18n";
import {useRouter} from "@/routes/hooks";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import React from "react";

export function PodsActionDropdown({row}: { row: Row<Pod> }) {
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
            className="text-rose-600 flex items-center gap-2"
          >
            <Trash2 className="text-rose-600"
                    size={16}/> {t("panel.page.pods.action.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function PodsActionProgress(
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

export const columns: ColumnDef<Pod, unknown>[] = [
  {
    header: "panel.page.pods.column.name",
    accessorKey: "name",
    enableSorting: true,
  },
  {
    header: "panel.page.pods.column.containers",
    accessorKey: "container",
    enableSorting: true,
    cell: ({row}) => {
      return (
        <span>{row.original.ready_containers} / {row.original.total_containers}</span>
      );
    },
  },
  {
    header: "panel.page.pods.column.status",
    accessorKey: "status",
    enableSorting: true,
  },
  {
    header: "panel.page.pods.column.age",
    accessorKey: "age",
    enableSorting: true,
    cell: ({row}) => {
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
        <span>{convertTime(row.original.age)}</span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    maxSize: 60,
    cell: ({row}) => {
      return <PodsActionDropdown row={row}/>
    },
  },
];