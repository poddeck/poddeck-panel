import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal, RefreshCcw, Trash2} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {type StatefulSet} from "@/api/services/stateful-set-service"
import {t} from "@/locales/i18n";
import StatefulSetDeleteDialog from "@/pages/panel/stateful-sets/delete-dialog.tsx";
import React from "react";
import {Dialog} from "@radix-ui/react-dialog";
import StatefulSetService from "@/api/services/stateful-set-service.ts";
import {toast} from "sonner";

export function StatefulSetsActionDropdown({statefulSet}: {
  statefulSet: StatefulSet
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
              StatefulSetService.restart({
                namespace: statefulSet ? statefulSet.namespace : "",
                stateful_set: statefulSet ? statefulSet.name : "",
              });
              toast.success(t("panel.page.stateful-sets.action.restart.successful"), {
                position: "top-right",
              });
            }}
            className="text-amber-600 flex items-center gap-2"
          >
            <RefreshCcw className="text-amber-600" size={16}/>
            {t("panel.page.stateful-sets.action.restart")}
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
              {t("panel.page.stateful-sets.action.delete")}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <StatefulSetDeleteDialog
          namespace={statefulSet.namespace}
          statefulSet={statefulSet.name}
          setOpen={setDeleteOpen}
        />
      </Dialog>
    </div>
  );
}