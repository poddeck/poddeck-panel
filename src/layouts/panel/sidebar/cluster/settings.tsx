import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {
  Edit2,
  Trash2
} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useSidebar} from "@/components/ui/sidebar.tsx";
import {DialogTrigger} from "@/components/ui/dialog.tsx";
import type {Cluster} from "@/api/services/cluster-service.ts";

export default function SidebarClusterSettings(
  {
    cluster,
    setClickedCluster,
    setDialogMode,
    children
  }: {
    cluster: Cluster
    setClickedCluster: React.Dispatch<React.SetStateAction<Cluster | null>>
    setDialogMode: React.Dispatch<React.SetStateAction<string>>
    children: React.ReactNode;
  }
) {
  const {t} = useTranslation();
  const {isMobile} = useSidebar()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="start"
        sideOffset={12}
      >
        <DialogTrigger asChild>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => {
              setClickedCluster(cluster);
              setDialogMode("edit")
            }}
          >
            <Edit2 size={16}/> {t("panel.sidebar.cluster.settings.edit")}
          </DropdownMenuItem>
        </DialogTrigger>
        <DropdownMenuSeparator/>
        <DialogTrigger asChild>
          <DropdownMenuItem
            className="text-rose-600 flex items-center gap-2"
            onClick={() => {
              setClickedCluster(cluster);
              setDialogMode("delete")
            }}
            variant="destructive"
          >
            <Trash2 className="text-rose-600"
                    size={16}/> {t("panel.sidebar.cluster.settings.delete")}
          </DropdownMenuItem>
        </DialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}