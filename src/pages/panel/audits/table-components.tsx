import {t} from "@/locales/i18n";
import {Badge} from "@/components/ui/badge.tsx";

export function AuditStatus({status}: {status: string}) {
  if (status === "PASS") {
    return <Badge
      className="px-4 py-2 -my-2 bg-green-600/10 text-green-600">
      {t("panel.page.audits.status.pass")}
    </Badge>;
  } else if (status === "FAIL") {
    return <Badge
      className="px-4 py-2 -my-2 bg-red-600/10 text-red-600">
      {t("panel.page.audits.status.fail")}
    </Badge>;
  } else if (status === "WARN") {
    return <Badge
      className="px-4 py-2 -my-2 bg-yellow-600/10 text-yellow-600">
      {t("panel.page.audits.status.warn")}
    </Badge>;
  } else if (status === "INFO") {
    return <Badge
      className="px-4 py-2 -my-2 bg-zinc-400/10 text-zinc-400">
      {t("panel.page.audits.status.info")}
    </Badge>;
  }
}