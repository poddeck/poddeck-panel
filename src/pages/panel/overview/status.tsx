"use client"

import {useClusters} from "@/hooks/use-cluster.ts";
import {Rocket} from "lucide-react";
import {CLUSTER_ICON_LIST} from "@/layouts/panel/sidebar/cluster/icon-list.tsx";
import clusterStore from "@/store/cluster-store.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip.tsx";
import {useTranslation} from "react-i18next";

export default function OverviewStatusBox() {
  const {t} = useTranslation();
  const {clusters, loading} = useClusters();
  if (loading || !clusters || clusters.length === 0) {
    return <div className="h-64 w-full animate-pulse rounded-xl bg-muted/50"/>
  }
  const activeCluster = clusterStore.getState().clusterId;
  const cluster = clusters.find(c => c.id === activeCluster) || clusters[0];
  const ActiveClusterIcon = CLUSTER_ICON_LIST.find(c => c.id === cluster.icon)?.icon || Rocket;

  return (
    <div className="bg-muted/50 aspect-video rounded-xl">
      <div className="flex justify-center items-center h-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`
                w-56 h-56 rounded-full flex items-center justify-center relative
                ${cluster.online ? 'bg-emerald-400/20' : 'bg-red-400/20'}
              `}
            >
              <div
                className={`
                  absolute w-full h-full rounded-full border-8
                  ${cluster.online
                        ? 'border-emerald-400 border-opacity-75 animate-pulse'
                        : 'border-red-500 border-opacity-90'}
                `}
              ></div>
              <div
                className={`
                  absolute w-full h-full rounded-full
                  ${cluster.online
                        ? 'shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-pulse'
                        : 'shadow-[0_0_50px_rgba(239,68,68,0.5)]'}
                `}
              ></div>
              <div className="flex flex-col items-center justify-center relative z-10">
                <ActiveClusterIcon className="w-12 h-12"/>
                <span className="mt-5 text-xl">{cluster.name}</span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className='max-w-64 text-pretty'>
            <p>{cluster.online ? t("panel.page.overview.online") : t("panel.page.overview.offline")}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
