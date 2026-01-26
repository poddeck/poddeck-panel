import PanelPage from "@/layouts/panel"
import {
  Empty, EmptyContent, EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty.tsx";
import {Check, Info, SearchCheck, TriangleAlert, X} from "lucide-react";
import {useTranslation} from "react-i18next";
import AuditRunButton from "@/pages/panel/audits/run-button.tsx";
import {useEffect, useState} from "react";
import auditService, {
  type Audit, type AuditEntry
} from "@/api/services/audit-service.ts";
import {columns} from "@/pages/panel/audits/table-columns.tsx";
import {DataTable} from "@/components/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import {Sheet} from "@/components/ui/sheet.tsx";
import AuditSheet from "@/pages/panel/audits/sheet.tsx";

function AuditPageEmpty({ onAuditComplete }: { onAuditComplete: () => void }) {
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
          <AuditRunButton onAuditComplete={onAuditComplete}/>
        </EmptyContent>
      </Empty>
    </PanelPage>
  )
}

export default function AuditPage() {
  const { t } = useTranslation();
  const [audit, setAudit] = useState<Audit>();
  const [isLoading, setIsLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<AuditEntry>();

  const loadAudit = async () => {
    setIsLoading(true);
    try {
      const response = await auditService.find();
      if (response.success) {
        setAudit(response.audit);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadAudit();
  }, []);

  if (!isLoading && audit == null) {
    return <AuditPageEmpty onAuditComplete={loadAudit}/>
  }
  const entries = audit == null ? [] : audit.controls.flatMap(control =>
    control.tests.flatMap(test =>
      test.results.map(result => ({
        control,
        test,
        result
      }))
    )
  );
  return (
    <PanelPage title="panel.page.audits.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <AuditRunButton onAuditComplete={loadAudit}/>
        </div>
        <div className="flex items-center gap-2 w-full mb-4">
          <Card className="w-full gap-0 pb-2 pt-4">
            <CardHeader>
              <CardTitle className="flex gap-2 text-green-600">
                <Check size={18} className="-translate-y-0.5"/> {t("panel.page.audits.status.pass")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl">
                {audit?.totals.total_pass}
              </span>
            </CardContent>
          </Card>
          <Card className="w-full gap-0 pb-2 pt-4">
            <CardHeader>
              <CardTitle className="flex gap-2 text-red-600">
                <X size={18} className="-translate-y-0.5"/> {t("panel.page.audits.status.fail")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl">
                {audit?.totals.total_fail}
              </span>
            </CardContent>
          </Card>
          <Card className="w-full gap-0 pb-2 pt-4">
            <CardHeader>
              <CardTitle className="flex gap-2 text-yellow-600">
                <TriangleAlert size={18} className="-translate-y-0.5"/> {t("panel.page.audits.status.warn")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl">
                {audit?.totals.total_warn}
              </span>
            </CardContent>
          </Card>
          <Card className="w-full gap-0 pb-2 pt-4">
            <CardHeader>
              <CardTitle className="flex gap-2 text-zinc-400">
                <Info size={18} className="-translate-y-0.5"/> {t("panel.page.audits.status.info")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl">
                {audit?.totals.total_info}
              </span>
            </CardContent>
          </Card>
        </div>
        <div className="mb-[4vh]">
          <span className="text-muted-foreground">
            {t("panel.page.audits.date")}: {audit ? new Date(audit.time).toLocaleString() : ""}
          </span>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <DataTable<AuditEntry>
            name="audit"
            columns={columns}
            data={entries}
            pageSize={5}
            initialSorting={[{id: "result.test_number", desc: false}]}
            isLoading={isLoading}
            onClick={entry => {
              setCurrentEntry(entry);
              setSheetOpen(true);
            }}
          />
          <AuditSheet entry={currentEntry}/>
        </Sheet>
      </div>
      <div className="flex justify-center my-6">
        <span className="text-sm text-muted-foreground">
          {t("panel.page.audits.powered.by")}
        </span>
      </div>
    </PanelPage>
  )
}
