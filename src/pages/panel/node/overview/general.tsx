import {Bolt} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {Node} from "@/api/services/node-service.ts";

export default function NodeOverviewGeneral(
  {
    node
  }: {
    node: Node | null
  }
) {
  const {t, i18n} = useTranslation();
  const language = (i18n.resolvedLanguage || "en_US").replace("_", "-");
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center gap-3 text-xl mb-5">
        <Bolt size={20}/> {t("panel.page.node.overview.general.title")}
      </span>
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.node.overview.general.namespace")}</span>
          <span>{node?.namespace}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.node.overview.general.start")}</span>
          <span>{new Date(Date.now() - (node ? node.age : 0)).toLocaleString(language)}</span>
        </div>
        <div className="flex justify-between gap-5 mb-2">
          <span
            className="text-primary/60">{t("panel.page.node.overview.general.labels")}</span>
          <div className="flex flex-col items-end gap-2">
            {node &&
              Object.entries(node.labels).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center bg-muted py-0.5 pr-0.5 rounded-lg"
                >
                  <span className="px-2">{key}</span>
                  <span
                    className="bg-background px-2 rounded-r-sm">{value}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="flex justify-between gap-5 mb-1">
          <span
            className="text-primary/60">{t("panel.page.node.overview.general.annotations")}</span>
          <div className="flex flex-col items-end gap-2">
            {node &&
              Object.entries(node.annotations).map(([key]) => (
                <div
                  key={key}
                  className="flex items-center bg-muted py-0.5 pr-0.5 rounded-lg"
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