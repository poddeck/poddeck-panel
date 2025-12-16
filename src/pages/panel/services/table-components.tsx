import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal, Trash2} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {type Service} from "@/api/services/service-service"
import {t} from "@/locales/i18n";
import ServiceDeleteDialog from "@/pages/panel/services/delete-dialog.tsx";
import React from "react";
import {Dialog} from "@radix-ui/react-dialog";

export function ServicesActionDropdown({service}: { service: Service }) {
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
              {t("panel.page.services.action.delete")}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <ServiceDeleteDialog
          namespace={service.namespace}
          service={service.name}
          setOpen={setDeleteOpen}
        />
      </Dialog>
    </div>
  );
}