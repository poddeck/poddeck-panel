import {Computer} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {Node} from "@/api/services/node-service.ts";

export default function NodeOverviewPlatform(
  {
    node
  }: {
    node: Node | null
  }
) {
  const {t} = useTranslation();
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center gap-3 text-xl mb-5">
        <Computer size={20}/> {t("panel.page.node.overview.platform.title")}
      </span>
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.node.overview.platform.architecture")}</span>
          <span>{node?.architecture}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.node.overview.platform.os")}</span>
          <span>{node?.operating_system}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.node.overview.platform.image")}</span>
          <span>{node?.os_image}</span>
        </div>
      </div>
    </div>
  );
}