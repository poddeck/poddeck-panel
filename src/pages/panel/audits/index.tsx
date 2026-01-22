import PanelPage from "@/layouts/panel"
import {
  Empty, EmptyContent, EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty.tsx";
import {SearchCheck} from "lucide-react";
import {useTranslation} from "react-i18next";
import AuditRunButton from "@/pages/panel/audits/run-button.tsx";
import {useEffect, useState} from "react";
import auditService, {type Audit} from "@/api/services/audit-service.ts";

function AuditPageEmpty() {
  const {t} = useTranslation();
  return (
    <PanelPage title="panel.page.audits.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchCheck/>
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.audits.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.audits.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <AuditRunButton/>
        </EmptyContent>
      </Empty>
    </PanelPage>
  )
}

export default function AuditPage() {
  const [audit, setAudit] = useState<Audit>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadAudit() {
      try {
        const response = await auditService.find();
        if (response.success) {
          setAudit(response.audit);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadAudit();
    const interval = window.setInterval(loadAudit, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  if (!isLoading && audit == null) {
    return <AuditPageEmpty/>
  }
  return (
    <PanelPage title="panel.page.audits.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <AuditRunButton/>
        </div>

      </div>
    </PanelPage>
  )
}
