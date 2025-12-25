import {type Row} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {
  Gauge,
  type LucideIcon,
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
  DropdownMenuSeparator,
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
              replace("/workload/?node=" + row.original.name);
            }}
            className="flex items-center gap-2"
          >
            <Gauge size={16}/> {t("panel.page.nodes.action.workload")}
          </DropdownMenuItem>
          <DropdownMenuSeparator/>
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
          <DropdownMenuSeparator/>
          <DropdownMenuItem
            onClick={() => {
            }}
            className="text-rose-600 flex items-center gap-2"
            variant="destructive"
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