import PanelPage from "@/layouts/panel"
import {
  Empty, EmptyContent, EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty.tsx";
import {Play, SearchCheck} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button.tsx";

function AuditRunButton() {
  const {t} = useTranslation();
  return (
    <Button
      size='lg'
      className='bg-primary'
    >
      <Play/>
      {t("panel.page.audits.run")}
    </Button>
  )
}

export default function AuditPage() {
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
