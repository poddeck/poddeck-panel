"use client"

import {useClusters} from "@/hooks/use-cluster.ts";
import {Lightbulb, Rocket} from "lucide-react";
import {CLUSTER_ICON_LIST} from "@/layouts/panel/sidebar/cluster/icon-list.tsx";
import clusterStore from "@/store/cluster-store.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip.tsx";
import {useTranslation} from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";

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
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Lightbulb size={18} className="-translate-y-0.5"/> {t("panel.page.overview.status.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center mt-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`
                  w-48 h-48 rounded-full flex items-center justify-center relative
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
              <p>
                {cluster.online ? t("panel.page.overview.status.online") :
                  t("panel.page.overview.status.offline")}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  )
}
