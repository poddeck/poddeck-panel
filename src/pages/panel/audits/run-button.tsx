import {useTranslation} from "react-i18next";
import AuditService from "@/api/services/audit-service.ts";
import {Button} from "@/components/ui/button.tsx";
import {Loader2, Play} from "lucide-react";

export default function AuditRunButton(
  {
    isUpdating,
    onAuditComplete
  }: {
    isUpdating: boolean;
    onAuditComplete: () => void
  }
) {
  const { t } = useTranslation();

  const handleRunAudit = () => {
    onAuditComplete();
    AuditService.perform();
  };

  return (
    <Button
      size="lg"
      className="bg-primary flex items-center gap-2"
      onClick={handleRunAudit}
      disabled={isUpdating}
    >
      {isUpdating ? (
        <>
          {t("panel.page.audits.running")}
          <Loader2 className="animate-spin" />
        </>
      ) : (
        <>
          <Play />
          {t("panel.page.audits.run")}
        </>
      )}
    </Button>
  );
}