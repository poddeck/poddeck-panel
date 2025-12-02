import {useEffect, useState} from "react";
import {DataTable} from "@/components/table";
import PanelPage from "@/layouts/panel";
import {useTranslation} from "react-i18next";
import {ServerIcon, Trash2} from "lucide-react";
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
import NamespaceAddButton from "./add-button.tsx";
import NamespaceService from "@/api/services/namespace-service";

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
          <NamespaceAddButton onCreation={() => window.location.reload()}/>
        </EmptyContent>
      </Empty>
    </PanelPage>
  )
}

export default function NamespacesPage() {
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const loadNamespaces = async () => {
    try {
      const response = await namespaceService.list();
      if (response.success !== false) {
        setNamespaces(response.namespaces);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadNamespaces();
    const interval = window.setInterval(loadNamespaces, 1000);
    return () => clearInterval(interval);
  }, []);
  if (!isLoading && namespaces.length === 0) {
    return <NamespaceListEmpty/>
  }
  return (
    <PanelPage title="panel.page.namespaces.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <NamespaceAddButton onCreation={loadNamespaces}/>
        </div>
        <DataTable<Namespace>
          name="namespaces"
          columns={columns}
          data={namespaces}
          pageSize={5}
          initialSorting={[{id: "name", desc: false}]}
          isLoading={isLoading}
          bulkActions={[
            {
              name: "panel.page.namespaces.action.delete",
              icon: Trash2,
              onClick: (entries) => {
                entries.forEach(entry => {
                  NamespaceService.remove({
                    name: entry.name
                  });
                })
              }
            }
          ]}
        />
      </div>
    </PanelPage>
  )
}
