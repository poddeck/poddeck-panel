import {Boxes} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {DaemonSet} from "@/api/services/daemon-set-service.ts";

export default function DaemonSetOverviewReplicas(
  {
    daemonSet
  }: {
    daemonSet: DaemonSet | null
  }
) {
  const {t} = useTranslation();
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center gap-3 text-xl mb-5">
        <Boxes size={20}/> {t("panel.page.daemon-set.overview.replicas.title")}
      </span>
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.daemon-set.overview.replicas.desired")}</span>
          <span>{daemonSet?.desired_number_scheduled}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.daemon-set.overview.replicas.current")}</span>
          <span>{daemonSet?.current_number_scheduled}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.daemon-set.overview.replicas.ready")}</span>
          <span>{daemonSet?.number_ready}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.daemon-set.overview.replicas.up-to-date")}</span>
          <span>{daemonSet?.updated_number_scheduled}</span>
        </div>
      </div>
    </div>
  );
}