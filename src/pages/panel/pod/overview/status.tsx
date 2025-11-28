import {Lightbulb} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {Pod} from "@/api/services/pod-service.ts";

export default function PodOverviewStatus({pod}: { pod: Pod | null }) {
  const {t} = useTranslation();
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center gap-3 text-xl mb-5">
        <Lightbulb size={20}/> {t("panel.page.pod.overview.status.title")}
      </span>
      <div className="overflow-y-auto flex-1">
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.pod.overview.status.status")}</span>
          <span>{pod?.status}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.pod.overview.status.restarts")}</span>
          <span>{pod?.restarts}</span>
        </div>
      </div>
    </div>
  );
}