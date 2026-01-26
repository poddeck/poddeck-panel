import {Bolt} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {ReplicaSet} from "@/api/services/replica-set-service.ts";

export default function ReplicaSetOverviewGeneral(
  {
    replicaSet
  }: {
    replicaSet: ReplicaSet | null
  }
) {
  const {t, i18n} = useTranslation();
  const language = (i18n.resolvedLanguage || "en_US").replace("_", "-");
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center gap-3 text-xl mb-5">
        <Bolt size={20}/> {t("panel.page.replica-set.overview.general.title")}
      </span>
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.replica-set.overview.general.namespace")}</span>
          <span>{replicaSet?.namespace}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.replica-set.overview.general.start")}</span>
          <span>{new Date(Date.now() - (replicaSet ? replicaSet.age : 0)).toLocaleString(language)}</span>
        </div>
        <div className="flex justify-between gap-5 mb-2">
          <span
            className="text-primary/60">{t("panel.page.replica-set.overview.general.labels")}</span>
          <div className="flex flex-col items-end gap-2">
            {replicaSet &&
              Object.entries(replicaSet.labels).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center bg-muted py-0.5 pr-0.5 rounded-lg"
                >
                  <span className="px-2">{key}</span>
                  <span
                    className="bg-background px-2 rounded-r-sm break-all">{value}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="flex justify-between gap-5 mb-1">
          <span
            className="text-primary/60">{t("panel.page.replica-set.overview.general.annotations")}</span>
          <div className="flex flex-col items-end gap-2">
            {replicaSet &&
              Object.entries(replicaSet.annotations).map(([key]) => (
                <div
                  key={key}
                  className="flex items-center bg-muted py-0.5 pr-0.5 rounded-lg break-all"
                >
                  <span className="px-2">{key}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}