import { DataTable } from "@/components/table";
import PanelPage from "@/layouts/panel";
import { useTranslation } from "react-i18next";
import { ServerIcon, Trash2 } from "lucide-react";
import namespaceService, {
  type Namespace,
} from "@/api/services/namespace-service";
import { columns } from "./table-columns";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import NamespaceAddButton from "./add-button.tsx";
import NamespaceService from "@/api/services/namespace-service";
import {
  useAgentQuery,
  useInvalidateAgentQuery,
} from "@/hooks/use-agent-query";

function NamespaceListEmpty() {
  const { t } = useTranslation();
  return (
    <PanelPage title="panel.page.namespaces.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ServerIcon />
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.namespaces.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.namespaces.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <NamespaceAddButton onCreation={() => window.location.reload()} />
        </EmptyContent>
      </Empty>
    </PanelPage>
  );
}

export default function NamespacesPage() {
  const invalidate = useInvalidateAgentQuery();
  const query = useAgentQuery(["namespaces"], namespaceService.list);
  const namespaces = query.data?.namespaces ?? [];
  if (!query.isLoading && !query.isError && namespaces.length === 0) {
    return <NamespaceListEmpty />;
  }
  return (
    <PanelPage title="panel.page.namespaces.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <NamespaceAddButton onCreation={() => invalidate(["namespaces"])} />
        </div>
        <DataTable<Namespace>
          name="namespaces"
          columns={columns}
          data={namespaces}
          pageSize={5}
          initialSorting={[{ id: "name", desc: false }]}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          isError={query.isError}
          onRetry={() => query.refetch()}
          bulkActions={[
            {
              name: "panel.page.namespaces.action.delete",
              icon: Trash2,
              onClick: (entries) => {
                Promise.allSettled(
                  entries.map((entry) =>
                    NamespaceService.remove({
                      name: entry.name,
                    }),
                  ),
                ).then(() => invalidate(["namespaces"]));
              },
            },
          ]}
        />
      </div>
    </PanelPage>
  );
}
