import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {ChevronsUpDown} from "lucide-react";

export default function SidebarClusterLoader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div
            className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <div className="flex items-center">
              <Skeleton className="bg-muted/50 w-30 h-3 rounded-md mb-2"/>
              <Skeleton className="bg-muted/50 size-1 rounded-xl"/>
            </div>
            <Skeleton className="bg-muted/50 w-15 h-3 rounded-md"/>
          </div>
          <ChevronsUpDown className="ml-auto"/>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}