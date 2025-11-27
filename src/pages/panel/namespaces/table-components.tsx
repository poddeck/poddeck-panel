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
import {useRouter} from "@/routes/hooks";
import type {Namespace} from "@/api/services/namespace-service.ts";

export function NamespacesActionDropdown({row}: { row: Row<Namespace> }) {
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
            onClick={() => {}}
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