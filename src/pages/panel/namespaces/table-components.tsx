import {type Row} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal, Trash2} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {t} from "@/locales/i18n";
import type {Namespace} from "@/api/services/namespace-service.ts";
import NamespaceDeleteDialog from "./delete-dialog.tsx";
import * as React from "react";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";

export function NamespacesActionDropdown({row}: { row: Row<Namespace> }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-fit hover:bg-black/10 dark:hover:bg-white/10 py-2 -my-2 rounded-full">
              <MoreHorizontal/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DialogTrigger asChild>
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-rose-600 flex items-center gap-2">
                  <Trash2 className="text-rose-600" size={16}/>
                  {t("panel.page.namespaces.action.delete")}
                </div>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <NamespaceDeleteDialog
          name={row.original.name}
          setOpen={setOpen}
        />
      </Dialog>
    </div>
  );
}

export function NamespaceAge({age}: { age: number }) {
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