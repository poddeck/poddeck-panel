import {AppHeader} from "@/layouts/panel/header";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import React, {useEffect, useState} from "react";
import ClusterService, {type Cluster} from "@/api/services/cluster-service.ts";
import {
  Card, CardContent,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import SidebarClusterStatus from "@/layouts/panel/sidebar/cluster/status.tsx";
import {useClusterActions} from "@/store/cluster-store.ts";
import {useRouter} from "@/routes/hooks";
import {t} from "@/locales/i18n.ts";
import {
  Box,
  Clock,
  Cpu, Layers,
  type LucideIcon,
  MemoryStick,
  Rocket,
  Server
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import SidebarClusterSettings
  from "@/layouts/panel/sidebar/cluster/settings.tsx";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import ClusterAddDialog from "@/layouts/panel/sidebar/cluster/add-dialog.tsx";
import ClusterEditDialog from "@/layouts/panel/sidebar/cluster/edit-dialog.tsx";
import ClusterDeleteDialog
  from "@/layouts/panel/sidebar/cluster/delete-dialog.tsx";
import {CLUSTER_ICON_LIST} from "@/layouts/panel/sidebar/cluster/icon-list.tsx";
import {ClusterAge} from "@/pages/panel/cluster/age.tsx";

export function ClusterProgress(
  {color, label, icon, usage, value, unit}: {
    color: string,
    label: string,
    icon: LucideIcon,
    usage: number,
    value: number,
    unit: string
  }
) {
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div className="inline-block w-full">
          <Progress value={usage} className={color}/>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className='w-fit'>
        <div className='flex items-center gap-4'>
          <Avatar className="h-12 w-12 rounded-lg">
            <AvatarFallback className="rounded-lg">
              {React.createElement(icon, {className: "size-8"})}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-1'>
            <div
              className='text-sm font-medium'>{label}</div>
            <div
              className='text-xl font-semibold'>{value.toFixed(2)} {unit}</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default function ClusterPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogMode, setDialogMode] = React.useState("add");
  const [clickedCluster, setClickedCluster] = React.useState<Cluster | null>(null);
  const [open, setOpen] = React.useState(false);
  const {setClusterId} = useClusterActions();
  const {replace} = useRouter();

  useEffect(() => {
    ClusterService.list()
      .then((res) => setClusters(res.clusters))
      .finally(() => setLoading(false));
  }, []);

  function clickCluster(cluster: Cluster) {
    setClusterId(cluster.id);
    replace("/overview/");
  }

  const handleClusterCreation = () => {
    replace("/overview/");
  };

  if (loading) {
    return <p className="text-gray-400">Loading clusters...</p>;
  }

  return (
    <SidebarProvider>
      <div className="w-full">
        <AppHeader title="panel.page.cluster.title" sidebar={false}/>
        <Dialog open={open} onOpenChange={setOpen}>
          <div
            className={"w-[min(1350px,95%)] mx-auto flex flex-wrap gap-4 flex-col flex-1"}>
            <div className="grid grid-cols-2 gap-8 my-[4vh]">
              {clusters.map((cluster) => {
                const Icon = CLUSTER_ICON_LIST.find(item => item.id === cluster.icon)?.icon || Rocket;
                return (
                  <div
                    className='relative w-full rounded-xl pt-0 shadow-lg aspect-video cursor-pointer'
                    onClick={() => clickCluster(cluster)}
                  >
                    <Card
                      className='border-none bg-linear-to-b from-zinc-800 to-zinc-950 pb-0 aspect-video'>
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle className='flex items-center gap-2'>
                            <div
                              className="flex size-10 items-center justify-center rounded-md border">
                              <Icon className="size-6 shrink-0"/>
                            </div>
                            <span className="text-lg">
                              {cluster.name}
                            </span>
                            <SidebarClusterStatus isOnline={cluster.online}/>
                          </CardTitle>
                          <div onClick={(e) => e.stopPropagation()}>
                            <SidebarClusterSettings
                              cluster={cluster}
                              setClickedCluster={setClickedCluster}
                              setDialogMode={setDialogMode}
                            />
                          </div>
                        </div>
                        <CardDescription className='flex items-center gap-4'>
                          <div className='flex items-center gap-1'>
                            <Clock size={15}/>
                            <ClusterAge age={Date.now() - cluster.created_at}/>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Layers size={15}/>
                            <span>
                              v1.33.5+k3s1
                            </span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-8">
                          <div className="flex flex-col gap-3 justify-center items-center border rounded-lg p-2">
                            <span className="text-4xl">
                              3
                            </span>
                            <span className="flex items-center gap-2">
                               <Server size={15}/> Nodes
                            </span>
                          </div>
                          <div className="flex flex-col gap-3 justify-center items-center border rounded-lg p-2">
                            <span className="text-4xl">
                              10
                            </span>
                            <span className="flex items-center gap-2">
                               <Rocket size={15}/> Deployments
                            </span>
                          </div>
                          <div className="flex flex-col gap-3 justify-center items-center border rounded-lg p-2">
                            <span className="text-4xl">
                              50
                            </span>
                            <span className="flex items-center gap-2">
                               <Box size={15}/> Pods
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className='bg-sidebar rounded-b-xl p-6 mt-auto'>
                        <div className='flex items-center gap-8 w-full text-muted-foreground text-sm'>
                          <div className="flex flex-col gap-2 w-full">
                            <div
                              className="flex items-center gap-2">
                          <span>
                            {t("panel.page.nodes.column.cpu")}
                          </span>
                              <span>
                            •
                          </span>
                              <span>
                            4 Kerne
                          </span>
                            </div>
                            <ClusterProgress
                              color="[&>div]:bg-sky-400"
                              label={t("panel.page.nodes.column.cpu")}
                              icon={Cpu}
                              usage={50}
                              value={50}
                              unit="%"
                            />
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <div
                              className="flex items-center gap-2">
                          <span>
                            {t("panel.page.nodes.column.memory")}
                          </span>
                              <span>
                            •
                          </span>
                              <span>
                            19.34 GB
                          </span>
                            </div>
                            <ClusterProgress
                              color="[&>div]:bg-emerald-400"
                              label={t("panel.page.nodes.column.memory")}
                              icon={MemoryStick}
                              usage={50}
                              value={50}
                              unit="GB"
                            />
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <div
                              className="flex items-center gap-2">
                          <span>
                            {t("panel.page.nodes.column.storage")}
                          </span>
                              <span>
                            •
                          </span>
                              <span>
                            230.65 GB
                          </span>
                            </div>
                            <ClusterProgress
                              color="[&>div]:bg-fuchsia-400"
                              label={t("panel.page.nodes.column.storage")}
                              icon={MemoryStick}
                              usage={50}
                              value={50}
                              unit="GB"
                            />
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                )
              })}
              <DialogTrigger asChild>
                <div
                  className="aspect-video border-2 border-dashed border-zinc-600 rounded-xl p-4 flex justify-center items-center text-zinc-600 cursor-pointer hover:bg-zinc-600/10 hover:text-zinc-500 transition">
                  + Neues Projekt
                </div>
              </DialogTrigger>
            </div>
          </div>
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
      </div>
    </SidebarProvider>
  )
}
