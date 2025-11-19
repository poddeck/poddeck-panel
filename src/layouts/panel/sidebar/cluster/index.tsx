"use client"

import * as React from "react"
import {ChevronsUpDown, Plus} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {useTranslation} from "react-i18next";

export function SidebarClusterSwitcher({
                                         clusters,
                                }: {
  clusters: {
    name: string
    logo: React.ElementType
  }[]
}) {
  const {t} = useTranslation();
  const {isMobile} = useSidebar()
  const [activeCluster, setActiveCluster] = React.useState(clusters[0])

  if (!activeCluster) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeCluster.logo className="size-4"/>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeCluster.name}</span>
                <span className="truncate text-xs">{t("panel.sidebar.cluster")}</span>
              </div>
              <ChevronsUpDown className="ml-auto"/>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t("panel.sidebar.clusters")}
            </DropdownMenuLabel>
            {clusters.map((cluster) => (
              <DropdownMenuItem
                key={cluster.name}
                onClick={() => setActiveCluster(cluster)}
                className="gap-2 p-2"
              >
                <div
                  className="flex size-6 items-center justify-center rounded-md border">
                  <cluster.logo className="size-3.5 shrink-0"/>
                </div>
                {cluster.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator/>
            <DropdownMenuItem className="gap-2 p-2">
              <div
                className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4"/>
              </div>
              <div
                className="text-muted-foreground font-medium">{t("panel.sidebar.cluster.add")}</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
