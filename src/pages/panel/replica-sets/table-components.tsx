import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal, Trash2} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {type ReplicaSet} from "@/api/services/replica-set-service"
import {t} from "@/locales/i18n";
import ReplicaSetDeleteDialog
  from "@/pages/panel/replica-sets/delete-dialog.tsx";
import React from "react";
import {Dialog} from "@radix-ui/react-dialog";

export function ReplicaSetsActionDropdown({replicaSet}: {
  replicaSet: ReplicaSet
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
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteOpen(true);
            }}
          >
            <div className="text-rose-600 flex items-center gap-2">
              <Trash2 className="text-rose-600" size={16}/>
              {t("panel.page.replica-sets.action.delete")}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <ReplicaSetDeleteDialog
          namespace={replicaSet.namespace}
          replicaSet={replicaSet.name}
          setOpen={setDeleteOpen}
        />
      </Dialog>
    </div>
  );
}