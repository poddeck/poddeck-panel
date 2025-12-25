import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import SidebarClusterStatus from "@/layouts/panel/sidebar/cluster/status.tsx";
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
import {CLUSTER_ICON_LIST} from "@/layouts/panel/sidebar/cluster/icon-list.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {ExtendedCluster} from "@/pages/panel/cluster/index.tsx";
import type {Cluster} from "@/api/services/cluster-service.ts";
import {useTranslation} from "react-i18next";
import {Age} from "@/components/age/age.tsx";

function ClusterUsageItem(
  {
    label,
    value,
    usage,
    total,
    icon: Icon,
    color,
    unit
  }: any
) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        <span>{label}</span>
        {total != "" && <span>•</span>}
        {total != "" && <span>{total}</span>}
      </div>
      <ClusterProgress
        color={color}
        label={label}
        icon={Icon}
        usage={usage}
        value={value}
        unit={unit}
      />
    </div>
  );
}

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

function ClusterMetric({label, value}: {
  label: string;
  value: number | string
}) {
  return (
    <div
      className="flex flex-col gap-1 justify-center items-center border border-zinc-300 dark:border-zinc-700 rounded-lg p-2">
      <span className="text-3xl">{value}</span>
      <span className="flex items-center gap-2">{label}</span>
    </div>
  );
}

export function ClusterCard(
  {
    cluster,
    onClick,
    setClickedCluster,
    setDialogMode
  }: {
    cluster: ExtendedCluster;
    onClick: () => void;
    setClickedCluster: React.Dispatch<React.SetStateAction<Cluster | null>>;
    setDialogMode: React.Dispatch<React.SetStateAction<string>>;
  }
) {
  const {t} = useTranslation();
  const Icon =
    CLUSTER_ICON_LIST.find(item => item.id === cluster.icon)?.icon ?? Rocket;

  const nodes = cluster.nodes;
  const totalNodes = nodes.length;

  const totalCpuCores = nodes.reduce((s, n) => s + n.cpu_cores, 0);
  const avgCpuUsage =
    totalNodes > 0 ? nodes.reduce((s, n) => s + n.cpu_ratio, 0) / totalNodes : 0;

  const totalMemory = nodes.reduce((s, n) => s + n.total_memory, 0);
  const usedMemory = nodes.reduce((s, n) => s + n.used_memory, 0);
  const memoryUsage = totalMemory > 0 ? (usedMemory / totalMemory) * 100 : 0;

  const totalStorage = nodes.reduce((s, n) => s + n.total_storage, 0);
  const usedStorage = nodes.reduce((s, n) => s + n.used_storage, 0);
  const storageUsage = totalStorage > 0 ? (usedStorage / totalStorage) * 100 : 0;

  return (
    <div
      className="relative w-full rounded-xl pt-0 shadow-lg aspect-video cursor-pointer"
      onClick={onClick}
    >
      <Card
        className="border-none gap-4 bg-linear-to-b from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-950 pb-0 pt-4 aspect-video">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="flex items-center gap-2">
              <div
                className="flex size-10 items-center justify-center rounded-md border border-zinc-300 dark:border-zinc-700">
                <Icon className="size-6"/>
              </div>
              <span className="text-lg">{cluster.name}</span>
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
                  className="p-1 h-8 w-8 ml-auto hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
                >
                  <Ellipsis className="size-7"/>
                </Button>
              </SidebarClusterSettings>
            </div>
          </div>

          <CardDescription className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock size={15}/>
              <Age age={Date.now() - cluster.created_at}/>
            </div>

            {cluster.online && (
              <div className="flex items-center gap-1">
                <Layers size={15}/>
                <span>{nodes[0]?.kubelet_version ?? "Unknown"}</span>
              </div>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <ClusterMetric label={t("panel.page.cluster.nodes")}
                           value={cluster.online ? totalNodes : "-"}/>
            <ClusterMetric label={t("panel.page.cluster.deployments")}
                           value={cluster.online ? cluster.deployments.length : "-"}/>
            <ClusterMetric label={t("panel.page.cluster.pods")}
                           value={cluster.online ? cluster.pods.length : "-"}/>
            <ClusterMetric label={t("panel.page.cluster.notifications")}
                           value={cluster.online ? cluster.notifications.length : "-"}/>
            <ClusterMetric label={t("panel.page.cluster.services")}
                           value={cluster.online ? cluster.services.length : "-"}/>
            <ClusterMetric label={t("panel.page.cluster.namespaces")}
                           value={cluster.online ? cluster.namespaces.length : "-"}/>
          </div>
        </CardContent>

        <CardFooter className="bg-sidebar rounded-b-xl px-7 py-4 mt-auto">
          <div className="flex items-center gap-8 w-full text-muted-foreground text-sm">
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-4">
                <ClusterUsageItem
                  color="[&>div]:bg-sky-400"
                  label={t("panel.page.nodes.column.cpu")}
                  icon={Cpu}
                  usage={avgCpuUsage}
                  value={avgCpuUsage}
                  total={cluster.online ? totalCpuCores + " " + t("panel.page.nodes.cores") : ""}
                  unit="%"
                />

                <ClusterUsageItem
                  color="[&>div]:bg-emerald-400"
                  label={t("panel.page.nodes.column.memory")}
                  icon={MemoryStick}
                  usage={memoryUsage}
                  value={usedMemory}
                  total={cluster.online ? totalMemory.toFixed(2) + " GB" : ""}
                  unit="GB"
                />

                <ClusterUsageItem
                  color="[&>div]:bg-fuchsia-400"
                  label={t("panel.page.nodes.column.storage")}
                  icon={MemoryStick}
                  usage={storageUsage}
                  value={usedStorage}
                  total={cluster.online ? totalStorage.toFixed(2) + " GB" : ""}
                  unit="GB"
                />
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}