import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal, RefreshCcw, Trash2} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {type DaemonSet} from "@/api/services/daemon-set-service"
import {t} from "@/locales/i18n";
import {Badge} from "@/components/ui/badge.tsx";
import DaemonSetDeleteDialog from "@/pages/panel/daemon-sets/delete-dialog.tsx";
import React from "react";
import {Dialog} from "@radix-ui/react-dialog";
import DaemonSetService from "@/api/services/daemon-set-service.ts";
import {toast} from "sonner";

export function DaemonSetsActionDropdown({daemonSet}: {
  daemonSet: DaemonSet
}) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-fit hover:bg-black/10 dark:hover:bg-white/10 py-2 -my-2 rounded-full"
          >
            <MoreHorizontal/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => {
              DaemonSetService.restart({
                namespace: daemonSet ? daemonSet.namespace : "",
                daemon_set: daemonSet ? daemonSet.name : "",
              });
              toast.success(t("panel.page.daemon-sets.action.restart.successful"), {
                position: "top-right",
              });
            }}
            className="text-amber-600 flex items-center gap-2"
          >
            <RefreshCcw className="text-amber-600" size={16}/>
            {t("panel.page.daemon-sets.action.restart")}
          </DropdownMenuItem>
          <DropdownMenuSeparator/>
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteOpen(true);
            }}
          >
            <div className="text-rose-600 flex items-center gap-2">
              <Trash2 className="text-rose-600" size={16}/>
              {t("panel.page.daemon-sets.action.delete")}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DaemonSetDeleteDialog
          namespace={daemonSet.namespace}
          daemonSet={daemonSet.name}
          setOpen={setDeleteOpen}
        />
      </Dialog>
    </div>
  );
}

export function DaemonSetsStatus({status}: { status: string }) {
  if (status === "pending") {
    return <Badge
      className="px-4 py-2 -my-2 bg-yellow-600/10 text-yellow-600">
      {t("panel.page.daemon-sets.status.pending")}
    </Badge>;
  } else if (status === "running") {
    return <Badge
      className="px-4 py-2 -my-2 bg-green-600/10 text-green-600">
      {t("panel.page.daemon-sets.status.running")}
    </Badge>;
  } else if (status === "succeeded") {
    return <Badge
      className="px-4 py-2 -my-2 bg-lime-600/10 text-lime-600">
      {t("panel.page.daemon-sets.status.succeeded")}
    </Badge>;
  } else if (status === "failed") {
    return <Badge
      className="px-4 py-2 -my-2 bg-red-600/10 text-red-600">
      {t("panel.page.daemon-sets.status.failed")}
    </Badge>;
  } else if (status === "unknown") {
    return <Badge
      className="px-4 py-2 -my-2 bg-zinc-400/10 text-zinc-400">
      {t("panel.page.daemon-sets.status.unknown")}
    </Badge>;
  }
}