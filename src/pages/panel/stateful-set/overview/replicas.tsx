import {Boxes} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {StatefulSet} from "@/api/services/stateful-set-service.ts";

export default function StatefulSetOverviewReplicas(
  {
    statefulSet
  }: {
    statefulSet: StatefulSet | null
  }
) {
  const {t} = useTranslation();
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center gap-3 text-xl mb-5">
        <Boxes size={20}/> {t("panel.page.stateful-set.overview.replicas.title")}
      </span>
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.stateful-set.overview.replicas.desired")}</span>
          <span>{statefulSet?.replicas}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.stateful-set.overview.replicas.current")}</span>
          <span>{statefulSet?.current_replicas}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.stateful-set.overview.replicas.ready")}</span>
          <span>{statefulSet?.ready_replicas}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.stateful-set.overview.replicas.up-to-date")}</span>
          <span>{statefulSet?.updated_replicas}</span>
        </div>
      </div>
    </div>
  );
}