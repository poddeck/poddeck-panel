import {
  SheetContent,
  SheetHeader, SheetTitle,
} from "@/components/ui/sheet.tsx";
import {useTranslation} from "react-i18next";
import type {AuditEntry} from "@/api/services/audit-service.ts";

export default function AuditSheet({entry}: {entry?: AuditEntry}) {
  const {t} = useTranslation();
  return (
    <SheetContent className="sm:max-w-[800px]" >
      <SheetHeader>
        <SheetTitle>{t("panel.page.audits.sheet.title")}</SheetTitle>
      </SheetHeader>
      <div className="relative flex-1 overflow-y-auto px-4">
        <span>{entry?.result.test_number}</span>
      </div>
    </SheetContent>
  )
}