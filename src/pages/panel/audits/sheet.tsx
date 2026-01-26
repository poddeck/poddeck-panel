import {
  SheetContent,
  SheetHeader, SheetTitle,
} from "@/components/ui/sheet.tsx";
import {useTranslation} from "react-i18next";
import type {AuditEntry} from "@/api/services/audit-service.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {AuditStatus} from "@/pages/panel/audits/table-components.tsx";

export default function AuditSheet({entry}: {entry?: AuditEntry}) {
  const {t} = useTranslation();
  return (
    <SheetContent className="sm:max-w-[800px]">
      <SheetHeader>
        <SheetTitle className="flex gap-4">{t("panel.page.audits.sheet.title")}  <AuditStatus status={entry ? entry.result.status.toUpperCase() : ""}/></SheetTitle>
      </SheetHeader>
      <div className="relative flex flex-col gap-6 flex-1 overflow-y-auto px-4">
        <div className="flex items-center gap-2 w-full">
          <Card className="w-full gap-0 pb-2 pt-4">
            <CardHeader>
              <CardTitle className="flex gap-2">
                {t("panel.page.audits.sheet.detected.version")}
              </CardTitle>
            </CardHeader>
            <CardContent>
            <span className="text-xl">
              {entry?.control.detected_version}
            </span>
            </CardContent>
          </Card>
          <Card className="w-full gap-0 pb-2 pt-4">
            <CardHeader>
              <CardTitle className="flex gap-2">
                {t("panel.page.audits.sheet.benchmark.version")}
              </CardTitle>
            </CardHeader>
            <CardContent>
            <span className="text-xl">
              {entry?.control.version}
            </span>
            </CardContent>
          </Card>
          <Card className="w-full gap-0 pb-2 pt-4">
            <CardHeader>
              <CardTitle className="flex gap-2">
                {t("panel.page.audits.sheet.number")}
              </CardTitle>
            </CardHeader>
            <CardContent>
            <span className="text-xl">
              {entry?.result.test_number}
            </span>
            </CardContent>
          </Card>
        </div>
        <div>
          <Label className="text-md mb-1">{t("panel.page.audits.sheet.section")}</Label>
          <Breadcrumb className="w-fit">
            <BreadcrumbList className='h-8 gap-2 rounded-md border px-3 text-sm'>
              <BreadcrumbItem>
                <BreadcrumbPage>{entry?.control.node_type}</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator> / </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{entry?.control.text}</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator> / </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{entry?.test.description}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {entry?.result.test_description != "" &&
          <div>
            <Label className="text-md mb-1">{t("panel.page.audits.sheet.test.description")}</Label>
            <div className="bg-card relative rounded-lg pt-1.5 pb-2 px-3">
              <code className="font-mono text-sm text-muted-foreground">
                {entry?.result.test_description}
              </code>
            </div>
          </div>
        }
        {entry?.result.audit != "" &&
          <div>
            <Label className="text-md mb-1">{t("panel.page.audits.sheet.audit")}</Label>
            <div className="bg-card relative rounded-lg pt-1.5 pb-2 px-3">
              <code className="font-mono text-sm text-muted-foreground">
                {entry?.result.audit}
              </code>
            </div>
          </div>
        }
        {entry?.result.expected_result != "" &&
          <div>
            <Label className="text-md mb-1">{t("panel.page.audits.sheet.expected.result")}</Label>
            <div className="bg-card relative rounded-lg pt-1.5 pb-2 px-3">
              <code className="font-mono text-sm text-muted-foreground">
                {entry?.result.expected_result}
              </code>
            </div>
          </div>
        }
        {entry?.result.reason != "" &&
          <div>
            <Label className="text-md mb-1">{t("panel.page.audits.sheet.reason")}</Label>
            <div className="bg-card relative rounded-lg pt-1.5 pb-2 px-3">
              <code className="font-mono text-sm text-muted-foreground">
                {entry?.result.reason}
              </code>
            </div>
          </div>
        }
        {entry?.result.remediation != "" &&
          <div>
            <Label className="text-md mb-1">{t("panel.page.audits.sheet.remediation")}</Label>
            <div className="bg-card relative rounded-lg pt-1.5 pb-2 px-3">
              <code className="font-mono text-sm text-muted-foreground">
                {entry?.result.remediation}
              </code>
            </div>
          </div>
        }
      </div>
    </SheetContent>
  )
}