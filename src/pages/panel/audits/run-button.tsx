import {useTranslation} from "react-i18next";
import {useState} from "react";
import AuditService from "@/api/services/audit-service.ts";
import {Button} from "@/components/ui/button.tsx";
import {Loader2, Play} from "lucide-react";

export default function AuditRunButton({ onAuditComplete }: { onAuditComplete: () => void }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleRunAudit = async () => {
    try {
      setLoading(true);
      const response = await AuditService.perform();
      if (response.success) {
        onAuditComplete();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      className="bg-primary flex items-center gap-2"
      onClick={handleRunAudit}
      disabled={loading}
    >
      {loading ? (
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