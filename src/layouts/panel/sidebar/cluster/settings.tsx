import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
  Edit2,
  EllipsisVertical,
  Trash2
} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useSidebar} from "@/components/ui/sidebar.tsx";
import {DialogTrigger} from "@/components/ui/dialog.tsx";

export default function SidebarClusterSettings() {
  const {t} = useTranslation();
  const {isMobile} = useSidebar()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-6 w-6 ml-auto hover:bg-black/10 dark:hover:bg-white/10 py-2 -my-2 rounded-full"
        >
          <EllipsisVertical/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="start"
        sideOffset={12}
      >
        <DialogTrigger asChild>
          <DropdownMenuItem
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2"
          >
            <Edit2 size={16}/> {t("panel.page.nodes.action.edit")}
          </DropdownMenuItem>
        </DialogTrigger>
        <DropdownMenuItem
          onClick={(e) => e.stopPropagation()}
          className="text-rose-600 flex items-center gap-2"
        >
          <Trash2 className="text-rose-600"
                  size={16}/> {t("panel.page.nodes.action.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}