"use client"

import * as React from "react"

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
import {Dialog, DialogTrigger,} from "@/components/ui/dialog"
import {useTranslation} from "react-i18next";
import ClusterService, {type Cluster} from "@/api/services/cluster-service.ts";
import {ChevronsUpDown, Plus, Rocket,} from "lucide-react";
import {CLUSTER_ICON_LIST} from "./icon-list";
import ClusterAddDialog from "./add-dialog.tsx";
import SidebarClusterStatus from "./status.tsx";
import SidebarClusterLoader from "./loader.tsx";
import clusterStore, {useClusterActions} from "@/store/cluster-store.ts";
import {useRouter} from "@/routes/hooks";
import SidebarClusterSettings
  from "@/layouts/panel/sidebar/cluster/settings.tsx";
import ClusterEditDialog from "@/layouts/panel/sidebar/cluster/edit-dialog.tsx";
import ClusterDeleteDialog
  from "@/layouts/panel/sidebar/cluster/delete-dialog.tsx";

export function SidebarClusterSwitcher() {
  const {t} = useTranslation();
  const {isMobile} = useSidebar()
  const [clusters, setClusters] = React.useState<Cluster[]>([]);
  const [activeCluster, setActiveCluster] = React.useState<Cluster | null>(null);
  const [clickedCluster, setClickedCluster] = React.useState<Cluster | null>(null);
  const [open, setOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState("add");
  const {setClusterId} = useClusterActions();
  const {replace} = useRouter();
  const updateCluster = (cluster: Cluster) => {
    setActiveCluster(cluster);
    setClusterId(cluster.id);
    replace("/");
  }
  React.useEffect(() => {
    async function fetchClusters() {
      try {
        const listResponse = await ClusterService.list();
        setClusters(listResponse.clusters);
        const selectedCluster = clusterStore.getState().clusterId;
        const filteredClusters = selectedCluster == null ? [] :
          listResponse.clusters.filter((entry: Cluster) => entry.id === selectedCluster);
        if (filteredClusters.length > 0) {
          setActiveCluster(filteredClusters[0]);
        } else if (listResponse.clusters.length > 0) {
          setActiveCluster(listResponse.clusters[0]);
        } else {
          const createResponse = await ClusterService.create({
            name: "Test",
            icon: "rocket"
          });
          setClusterId(createResponse.cluster);
          window.location.reload();
        }
      } catch (err) {
        console.error("Failed to load clusters", err);
      }
    }
    fetchClusters();
  }, []);
  const handleClusterCreation = (cluster: Cluster) => {
    setClusters([...clusters, cluster]);
    updateCluster(cluster);
    setOpen(false);
  };
  if (activeCluster == null) {
    return <SidebarClusterLoader/>
  }
  const ActiveClusterIcon = CLUSTER_ICON_LIST.find(item => item.id === activeCluster?.icon)?.icon || Rocket;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div
                  className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ActiveClusterIcon className="size-4"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex items-center">
                    <span
                      className="truncate font-medium me-2">{activeCluster?.name}</span>
                    <SidebarClusterStatus
                      isOnline={!activeCluster ? false : activeCluster.online}/>
                  </div>
                  <span
                    className="truncate text-xs">{t("panel.sidebar.cluster")}</span>
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
              {clusters.map((cluster) => {
                const Icon = CLUSTER_ICON_LIST.find(item => item.id === cluster.icon)?.icon || Rocket;
                return (
                  <DropdownMenuItem
                    key={cluster.name}
                    onClick={() => updateCluster(cluster)}
                    className="gap-2 p-2"
                  >
                    <div
                      className="flex size-6 items-center justify-center rounded-md border">
                      <Icon className="size-3.5 shrink-0"/>
                    </div>
                    {cluster.name}
                    <SidebarClusterStatus isOnline={cluster.online}/>
                    <div className="flex items-center ml-auto" onClick={(e) => e.stopPropagation()}>
                      <SidebarClusterSettings
                        cluster={cluster}
                        setClickedCluster={setClickedCluster}
                        setDialogMode={setDialogMode}
                      />
                    </div>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator/>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => {setDialogMode("add")}}
                >
                  <div
                    className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4"/>
                  </div>
                  <div
                    className="text-muted-foreground font-medium">{t("panel.sidebar.cluster.add")}</div>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          {open && dialogMode === "add" && (
            <ClusterAddDialog
              onCreation={handleClusterCreation}
            />
          )}
          {open && dialogMode === "edit" && (
            <ClusterEditDialog
              id={clickedCluster?.id}
              name={clickedCluster?.name}
              icon={clickedCluster?.icon}
            />
          )}
          {open && dialogMode === "delete" && (
            <ClusterDeleteDialog
              id={clickedCluster?.id}
              name={clickedCluster?.name}
            />
          )}
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
