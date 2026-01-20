"use client"

import {useClusters} from "@/hooks/use-cluster.ts";
import {Lightbulb, Rocket, Wifi, WifiOff} from "lucide-react";
import {CLUSTER_ICON_LIST} from "@/layouts/panel/sidebar/cluster/icon-list.tsx";
import clusterStore from "@/store/cluster-store.ts";
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
          <Lightbulb size={18} className="-tranneutral-y-0.5"/> {t("panel.page.overview.status.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {cluster.online && (
              <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-tr from-emerald-500/20 to-emerald-400/20 blur-2xl animate-pulse" />
            )}

            <div
              className={`
                relative w-44 h-44 rounded-full flex items-center justify-center
                transition-all duration-500
                ${cluster.online
                ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40'
                : 'bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900/40 dark:to-neutral-800/40'
              }
              `}
            >
              <div
                className={`
                  absolute inset-0 rounded-full
                  ${cluster.online
                  ? 'bg-gradient-to-tr from-emerald-400 via-emerald-500 to-emerald-400 opacity-60'
                  : 'bg-gradient-to-tr from-red-400 via-red-500 to-red-400 opacity-40'}
                  ${cluster.online ? 'animate-spin-slow' : ''}
                `}
                style={{
                  padding: '3px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude'
                }}
              />

              <div className="absolute inset-[3px] rounded-full bg-card/75" />

              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`
                  p-4 rounded-2xl transition-colors duration-500
                  ${cluster.online
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                }
                `}>
                  <ActiveClusterIcon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {cluster.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
                transition-all duration-300
                ${cluster.online
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shadow-emerald-200/50 dark:shadow-emerald-900/30'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 shadow-red-200/50 dark:shadow-red-900/30'
              }
              `}
            >
              {cluster.online ? (
                <>
                  <Wifi size={16} className="animate-pulse" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff size={16} />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
