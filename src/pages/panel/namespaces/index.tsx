import {useEffect, useState} from "react";
import {DataTable} from "@/components/table";
import PanelPage from "@/layouts/panel";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import {PlusIcon, ServerIcon} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip.tsx";
import namespaceService, {
  type Namespace
} from "@/api/services/namespace-service"
import {columns} from "./table-columns";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

function NamespaceAddButton() {
  const {t} = useTranslation();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size='lg'
          className='bg-primary'
        >
          <PlusIcon/>
          {t("panel.page.namespaces.add")}
        </Button>
      </TooltipTrigger>
      <TooltipContent className='max-w-64 text-pretty'>
        <div className='flex items-center gap-1.5'>
          <p>{t("coming.soon")}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function NamespaceListEmpty() {
  const {t} = useTranslation();
  return (
    <PanelPage title="panel.page.namespaces.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ServerIcon/>
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.namespaces.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.namespaces.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <NamespaceAddButton/>
        </EmptyContent>
      </Empty>
    </PanelPage>
  )
}

export default function NamespacesPage() {
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadNamespaces() {
      try {
        const response = await namespaceService.list();
        if (response.success != false) {
          setNamespaces(response.namespaces);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadNamespaces();
    const interval = window.setInterval(loadNamespaces, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  if (!isLoading && namespaces.length === 0) {
    return <NamespaceListEmpty/>
  }
  return (
    <PanelPage title="panel.page.namespaces.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <NamespaceAddButton/>
        </div>
        <DataTable<Namespace>
          name="namespaces"
          columns={columns}
          data={namespaces}
          pageSize={5}
          initialSorting={[{id: "name", desc: false}]}
          isLoading={isLoading}
        />
      </div>
    </PanelPage>
  )
}
