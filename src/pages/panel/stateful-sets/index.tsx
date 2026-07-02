import { DataTable } from "@/components/table";
import PanelPage from "@/layouts/panel";
import { useTranslation } from "react-i18next";
import { Box, PlusIcon, RefreshCcw, Trash2 } from "lucide-react";
import statefulSetService, {
  type StatefulSet,
} from "@/api/services/stateful-set-service";
import { columns } from "./table-columns";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useRouter } from "@/routes/hooks";
import namespaceService from "@/api/services/namespace-service.ts";
import StatefulSetService from "@/api/services/stateful-set-service";
import {
  useAgentQuery,
  useInvalidateAgentQuery,
} from "@/hooks/use-agent-query";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import StatefulSetAddDialog from "@/pages/panel/stateful-sets/add-dialog.tsx";

function StatefulSetAddButton() {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="lg" className="bg-primary">
          <PlusIcon />
          {t("panel.page.stateful-sets.add")}
        </Button>
      </DialogTrigger>
      <StatefulSetAddDialog />
    </Dialog>
  );
}

function StatefulSetListEmpty() {
  const { t } = useTranslation();
  return (
    <PanelPage title="panel.page.stateful-sets.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Box />
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.stateful-sets.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.stateful-sets.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <StatefulSetAddButton />
        </EmptyContent>
      </Empty>
    </PanelPage>
  );
}

export default function StatefulSetsPage() {
  const { push } = useRouter();
  const invalidate = useInvalidateAgentQuery();
  const query = useAgentQuery(["stateful-sets"], statefulSetService.list);
  const namespacesQuery = useAgentQuery(["namespaces"], namespaceService.list);
  const statefulSets = query.data?.stateful_sets ?? [];
  const namespaces = namespacesQuery.data?.namespaces ?? [];
  if (!query.isLoading && !query.isError && statefulSets.length === 0) {
    return <StatefulSetListEmpty />;
  }
  return (
    <PanelPage title="panel.page.stateful-sets.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <StatefulSetAddButton />
        </div>
        <DataTable<StatefulSet>
          name="stateful-sets"
          columns={columns}
          data={statefulSets}
          pageSize={5}
          initialSorting={[{ id: "namespace", desc: false }]}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          isError={query.isError}
          onRetry={() => query.refetch()}
          visibilityState={{ node: false, ip: false }}
          filters={[
            {
              column: "namespace",
              options: namespaces.map((namespace) => namespace.name),
            },
          ]}
          onClick={(statefulSet) =>
            push(
              "/stateful-set/overview/?" +
                "stateful-set=" +
                statefulSet.name +
                "&namespace=" +
                statefulSet.namespace,
            )
          }
          bulkActions={[
            {
              name: "panel.page.stateful-sets.action.restart",
              icon: RefreshCcw,
              onClick: (entries) => {
                Promise.allSettled(
                  entries.map((entry) =>
                    StatefulSetService.restart({
                      namespace: entry.namespace,
                      stateful_set: entry.name,
                    }),
                  ),
                ).then(() => invalidate(["stateful-sets"]));
              },
            },
            {
              name: "panel.page.stateful-sets.action.delete",
              icon: Trash2,
              onClick: (entries) => {
                Promise.allSettled(
                  entries.map((entry) =>
                    StatefulSetService.remove({
                      namespace: entry.namespace,
                      stateful_set: entry.name,
                    }),
                  ),
                ).then(() => invalidate(["stateful-sets"]));
              },
            },
          ]}
        />
      </div>
    </PanelPage>
  );
}
