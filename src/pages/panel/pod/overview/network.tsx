import {Network} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {Pod} from "@/api/services/pod-service.ts";

export default function PodOverviewNetwork({pod}: { pod: Pod | null }) {
  const {t} = useTranslation();
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center gap-3 text-xl mb-5">
        <Network size={20}/> {t("panel.page.pod.overview.network.title")}
      </span>
      <div className="overflow-y-auto flex-1">
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.pod.overview.network.host.ip")}</span>
          <span>{pod?.host_ip}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.pod.overview.network.pod.ip")}</span>
          <span>{pod?.pod_ip}</span>
        </div>
      </div>
    </div>
  );
}