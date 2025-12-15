"use client"

import {useTranslation} from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import {ServerIcon, Cpu, MemoryStick, HardDrive} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {type Node} from "@/api/services/node-service.ts";

export default function OverviewNodesBox({nodes}: {nodes: Node[]}) {
  const {t} = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex gap-2">
            <ServerIcon size={18} className="-translate-y-0.5"/> {t("panel.page.overview.nodes.title")}
          </div>
          <span>
            {nodes.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {nodes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {nodes.map((node) => (
              <div key={node.name} className="p-3 rounded-lg border hover:bg-muted transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">{node.name}</span>
                  {node.ready ? (
                    <Badge className="bg-green-600/10 text-green-600">
                      {t("panel.page.nodes.status.ready")}
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-600/10 text-rose-600">
                      {t("panel.page.nodes.status.not.ready")}
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Cpu size={14} className="text-sky-500" />
                    <span className="font-medium">{node.cpu_cores} {t("panel.page.nodes.cores")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MemoryStick size={14} className="text-emerald-500" />
                    <span className="font-medium">{node.total_memory.toFixed(0)} GB</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HardDrive size={14} className="text-fuchsia-500" />
                    <span className="font-medium">{node.total_storage.toFixed(0)} GB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            {t("panel.page.nodes.empty.description")}
          </p>
        )}
      </CardContent>
    </Card>
  )
}