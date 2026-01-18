import {Box} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {ReplicaSet} from "@/api/services/replica-set-service.ts";

export default function ReplicaSetOverviewContainer(
  {
    replicaSet
  }: {
    replicaSet: ReplicaSet | null
  }
) {
  const {t} = useTranslation();
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center gap-3 text-xl mb-5">
        <Box size={20}/> {t("panel.page.replica-set.overview.container.title")}
      </span>
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.replica-set.overview.container.name")}</span>
          <span>{replicaSet?.container_name}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.replica-set.overview.container.image")}</span>
          <span>{replicaSet?.container_image}</span>
        </div>
      </div>
    </div>
  );
}