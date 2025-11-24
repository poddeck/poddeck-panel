"use client"

import * as React from "react"
import {
  ChevronsUpDown,
  EllipsisVertical,
  Plus
} from "lucide-react"

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button.tsx";
import ClusterService from "@/api/services/cluster-service.ts";
import {Spinner} from "@/components/ui/spinner.tsx";
import {toast} from "sonner";

function SidebarClusterStatus() {
  return (
    <span className="relative flex size-2">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
      <span
        className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
    </span>
  )
}

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
  const [activeCluster, setActiveCluster] = React.useState(clusters[0]);
  const [newClusterName, setNewClusterName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleCreateCluster = async () => {
    if (!newClusterName.trim()) {
      return;
    }
    try {
      setLoading(true);
      await ClusterService.create({name: newClusterName});
      const response = await ClusterService.list();
      const created = response.clusters.find(c => c.name === newClusterName);
      if (created) {
        setActiveCluster({name: created.name, logo: activeCluster.logo});
      }
      setNewClusterName("");
    } finally {
      setLoading(false);
      setOpen(false);
      toast.success(t("panel.sidebar.cluster.add.successful"), {
        position: "top-right",
      });
    }
  };
  if (!activeCluster) {
    return null;
  }
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
                  <activeCluster.logo className="size-4"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex items-center">
                    <span
                      className="truncate font-medium me-2">{activeCluster.name}</span>
                    <SidebarClusterStatus/>
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
                  <SidebarClusterStatus/>
                  <Button variant="ghost" size="sm"
                          className="p-1 h-6 w-6 ml-auto">
                    <EllipsisVertical/>
                  </Button>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator/>
              <DropdownMenuItem className="gap-2 p-2">
                <div
                  className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4"/>
                </div>
                <DialogTrigger asChild>
                  <div
                    className="text-muted-foreground font-medium">{t("panel.sidebar.cluster.add")}</div>
                </DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("panel.sidebar.cluster.add.dialog.title")}</DialogTitle>
              <DialogDescription>
                {t("panel.sidebar.cluster.add.dialog.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label
                  htmlFor="name">{t("panel.sidebar.cluster.add.dialog.name")}</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t("panel.sidebar.cluster.add.dialog.name")}
                  value={newClusterName}
                  onChange={(e) => setNewClusterName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline">{t("panel.sidebar.cluster.add.dialog.cancel")}</Button>
              </DialogClose>
              <Button onClick={handleCreateCluster} disabled={loading}>
                {t("panel.sidebar.cluster.add.dialog.submit")}
                {loading && <Spinner className="ml-2"></Spinner>}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
