import { DataTable } from "@/components/table";
import PanelPage from "@/layouts/panel";
import { useTranslation } from "react-i18next";
import { Box, PlusIcon, RefreshCcw, Trash2 } from "lucide-react";
import daemonSetService, {
  type DaemonSet,
} from "@/api/services/daemon-set-service";
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
import DaemonSetService from "@/api/services/daemon-set-service";
import {
  useAgentQuery,
  useInvalidateAgentQuery,
} from "@/hooks/use-agent-query";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import DaemonSetAddDialog from "@/pages/panel/daemon-sets/add-dialog.tsx";

function DaemonSetAddButton() {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="lg" className="bg-primary">
          <PlusIcon />
          {t("panel.page.daemon-sets.add")}
        </Button>
      </DialogTrigger>
      <DaemonSetAddDialog />
    </Dialog>
  );
}

function DaemonSetListEmpty() {
  const { t } = useTranslation();
  return (
    <PanelPage title="panel.page.daemon-sets.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Box />
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.daemon-sets.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.daemon-sets.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <DaemonSetAddButton />
        </EmptyContent>
      </Empty>
    </PanelPage>
  );
}

export default function DaemonSetsPage() {
  const { push } = useRouter();
  const invalidate = useInvalidateAgentQuery();
  const query = useAgentQuery(["daemon-sets"], daemonSetService.list);
  const namespacesQuery = useAgentQuery(["namespaces"], namespaceService.list);
  const daemonSets = query.data?.daemon_sets ?? [];
  const namespaces = namespacesQuery.data?.namespaces ?? [];
  if (!query.isLoading && !query.isError && daemonSets.length === 0) {
    return <DaemonSetListEmpty />;
  }
  return (
    <PanelPage title="panel.page.daemon-sets.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <DaemonSetAddButton />
        </div>
        <DataTable<DaemonSet>
          name="daemon-sets"
          columns={columns}
          data={daemonSets}
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
          onClick={(daemonSet) =>
            push(
              "/daemon-set/overview/?" +
                "daemon-set=" +
                daemonSet.name +
                "&namespace=" +
                daemonSet.namespace,
            )
          }
          bulkActions={[
            {
              name: "panel.page.daemon-sets.action.restart",
              icon: RefreshCcw,
              onClick: (entries) => {
                Promise.allSettled(
                  entries.map((entry) =>
                    DaemonSetService.restart({
                      namespace: entry.namespace,
                      daemon_set: entry.name,
                    }),
                  ),
                ).then(() => invalidate(["daemon-sets"]));
              },
            },
            {
              name: "panel.page.daemon-sets.action.delete",
              icon: Trash2,
              onClick: (entries) => {
                Promise.allSettled(
                  entries.map((entry) =>
                    DaemonSetService.remove({
                      namespace: entry.namespace,
                      daemon_set: entry.name,
                    }),
                  ),
                ).then(() => invalidate(["daemon-sets"]));
              },
            },
          ]}
        />
      </div>
    </PanelPage>
  );
}
