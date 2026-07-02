import { DataTable } from "@/components/table";
import PanelPage from "@/layouts/panel";
import { useTranslation } from "react-i18next";
import { Box, PlusIcon, Trash2 } from "lucide-react";
import replicaSetService from "@/api/services/replica-set-service";
import ReplicaSetService, {
  type ReplicaSet,
} from "@/api/services/replica-set-service";
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
import {
  useAgentQuery,
  useInvalidateAgentQuery,
} from "@/hooks/use-agent-query";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import ReplicaSetAddDialog from "@/pages/panel/replica-sets/add-dialog.tsx";

function ReplicaSetAddButton() {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="lg" className="bg-primary">
          <PlusIcon />
          {t("panel.page.replica-sets.add")}
        </Button>
      </DialogTrigger>
      <ReplicaSetAddDialog />
    </Dialog>
  );
}

function ReplicaSetListEmpty() {
  const { t } = useTranslation();
  return (
    <PanelPage title="panel.page.replica-sets.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Box />
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.replica-sets.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.replica-sets.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ReplicaSetAddButton />
        </EmptyContent>
      </Empty>
    </PanelPage>
  );
}

export default function ReplicaSetsPage() {
  const { push } = useRouter();
  const invalidate = useInvalidateAgentQuery();
  const query = useAgentQuery(["replica-sets"], replicaSetService.list);
  const namespacesQuery = useAgentQuery(["namespaces"], namespaceService.list);
  const replicaSets = query.data?.replica_sets ?? [];
  const namespaces = namespacesQuery.data?.namespaces ?? [];
  if (!query.isLoading && !query.isError && replicaSets.length === 0) {
    return <ReplicaSetListEmpty />;
  }
  return (
    <PanelPage title="panel.page.replica-sets.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <ReplicaSetAddButton />
        </div>
        <DataTable<ReplicaSet>
          name="replica-sets"
          columns={columns}
          data={replicaSets}
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
          onClick={(replicaSet) =>
            push(
              "/replica-set/overview/?" +
                "replica-set=" +
                replicaSet.name +
                "&namespace=" +
                replicaSet.namespace,
            )
          }
          bulkActions={[
            {
              name: "panel.page.replica-sets.action.delete",
              icon: Trash2,
              onClick: (entries) => {
                Promise.allSettled(
                  entries.map((entry) =>
                    ReplicaSetService.remove({
                      namespace: entry.namespace,
                      replica_set: entry.name,
                    }),
                  ),
                ).then(() => invalidate(["replica-sets"]));
              },
            },
          ]}
        />
      </div>
    </PanelPage>
  );
}
