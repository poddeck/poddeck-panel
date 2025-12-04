import {Boxes} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {Deployment} from "@/api/services/deployment-service.ts";

export default function DeploymentOverviewReplicas(
  {
    deployment
  }: {
    deployment: Deployment | null
  }
) {
  const {t} = useTranslation();
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center gap-3 text-xl mb-5">
        <Boxes size={20}/> {t("panel.page.deployment.overview.replicas.title")}
      </span>
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.deployment.overview.replicas.replicas")}</span>
          <span>{deployment?.replicas}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.deployment.overview.replicas.updated")}</span>
          <span>{deployment?.updated_replicas}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.deployment.overview.replicas.ready")}</span>
          <span>{deployment?.ready_replicas}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.deployment.overview.replicas.available")}</span>
          <span>{deployment?.available_replicas}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.deployment.overview.replicas.unavailable")}</span>
          <span>{deployment?.unavailable_replicas}</span>
        </div>
      </div>
    </div>
  );
}