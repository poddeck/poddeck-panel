import {AppHeader} from "@/layouts/panel/header";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import React, {useEffect, useState} from "react";
import ClusterService, {type Cluster} from "@/api/services/cluster-service.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import SidebarClusterStatus from "@/layouts/panel/sidebar/cluster/status.tsx";
import {useClusterActions} from "@/store/cluster-store.ts";
import {useRouter} from "@/routes/hooks";
import {t} from "@/locales/i18n.ts";
import {
  Clock,
  Cpu,
  Ellipsis,
  Layers,
  type LucideIcon,
  MemoryStick,
  Rocket
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
import {Button} from "@/components/ui/button.tsx";
import NodeService, {type Node} from "@/api/services/node-service.ts";

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
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogMode, setDialogMode] = React.useState("add");
  const [clickedCluster, setClickedCluster] = React.useState<Cluster | null>(null);
  const [open, setOpen] = React.useState(false);
  const {setClusterId} = useClusterActions();
  const {replace} = useRouter();

  useEffect(() => {
    Promise.all([
      ClusterService.list(),
      NodeService.list(),
    ])
      .then(([clusterRes, nodeRes]) => {
        setClusters(clusterRes.clusters);
        setNodes(nodeRes.nodes);
      })
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

  const latestVersion =
    nodes
      .map(n => n.version)
      .sort()
      .reverse()[0] ?? "Unknown";

  const totalCpuCores = nodes.reduce((sum, n) => sum + n.cpu_cores, 0);

  const avgCpuUsage =
    nodes.length > 0
      ? nodes.reduce((sum, n) => sum + n.cpu_ratio, 0) / nodes.length
      : 0;

  const totalMemory = nodes.reduce((sum, n) => sum + n.total_memory, 0);
  const usedMemory = nodes.reduce((sum, n) => sum + n.used_memory, 0);
  const avgMemoryUsage = totalMemory > 0 ? (usedMemory / totalMemory) * 100 : 0;

  const totalStorage = nodes.reduce((sum, n) => sum + n.total_storage, 0);
  const usedStorage = nodes.reduce((sum, n) => sum + n.used_storage, 0);
  const avgStorageUsage = totalStorage > 0 ? (usedStorage / totalStorage) * 100 : 0;


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
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-8 w-8 ml-auto hover:bg-black/10 dark:hover:bg-white/10 py-1 -my-1 rounded-full"
                              >
                                <Ellipsis className="size-7"/>
                              </Button>
                            </SidebarClusterSettings>
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
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col gap-2 justify-center items-center border rounded-lg p-2">
                            <span className="text-3xl">3</span>
                            <span className="flex items-center gap-2">Nodes</span>
                          </div>
                          <div className="flex flex-col gap-2 justify-center items-center border rounded-lg p-2">
                            <span className="text-3xl">10
                            </span>
                            <span className="flex items-center gap-2">Deployments</span>
                          </div>
                          <div className="flex flex-col gap-2 justify-center items-center border rounded-lg p-2">
                            <span className="text-3xl">50
                            </span>
                            <span className="flex items-center gap-2">Pods</span>
                          </div>
                          <div className="flex flex-col gap-2 justify-center items-center border rounded-lg p-2">
                            <span className="text-3xl">5</span>
                            <span className="flex items-center gap-2">Notifications</span>
                          </div>
                          <div className="flex flex-col gap-2 justify-center items-center border rounded-lg p-2">
                            <span className="text-3xl">8</span>
                            <span className="flex items-center gap-2">Services</span>
                          </div>
                          <div className="flex flex-col gap-2 justify-center items-center border rounded-lg p-2">
                            <span className="text-3xl">4</span>
                            <span className="flex items-center gap-2">Namespaces</span>
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
