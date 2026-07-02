import { DataTable } from "@/components/table";
import PanelPage from "@/layouts/panel";
import { useTranslation } from "react-i18next";
import { Box, PlusIcon, Trash2 } from "lucide-react";
import cronJobService from "@/api/services/cron-job-service";
import CronJobService, { type CronJob } from "@/api/services/cron-job-service";
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
import CronJobAddDialog from "@/pages/panel/cron-jobs/add-dialog.tsx";

function CronJobAddButton() {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="lg" className="bg-primary">
          <PlusIcon />
          {t("panel.page.cron-jobs.add")}
        </Button>
      </DialogTrigger>
      <CronJobAddDialog />
    </Dialog>
  );
}

function CronJobListEmpty() {
  const { t } = useTranslation();
  return (
    <PanelPage title="panel.page.cron-jobs.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Box />
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.cron-jobs.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.cron-jobs.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CronJobAddButton />
        </EmptyContent>
      </Empty>
    </PanelPage>
  );
}

export default function CronJobsPage() {
  const { push } = useRouter();
  const invalidate = useInvalidateAgentQuery();
  const query = useAgentQuery(["cron-jobs"], cronJobService.list);
  const namespacesQuery = useAgentQuery(["namespaces"], namespaceService.list);
  const cronJobs = query.data?.cron_jobs ?? [];
  const namespaces = namespacesQuery.data?.namespaces ?? [];
  if (!query.isLoading && !query.isError && cronJobs.length === 0) {
    return <CronJobListEmpty />;
  }
  return (
    <PanelPage title="panel.page.cron-jobs.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <CronJobAddButton />
        </div>
        <DataTable<CronJob>
          name="cronJobs"
          columns={columns}
          data={cronJobs}
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
          onClick={(cronJob) =>
            push(
              "/cron-job/overview/?" +
                "cron-job=" +
                cronJob.name +
                "&namespace=" +
                cronJob.namespace,
            )
          }
          bulkActions={[
            {
              name: "panel.page.cron-jobs.action.delete",
              icon: Trash2,
              onClick: (entries) => {
                Promise.allSettled(
                  entries.map((entry) =>
                    CronJobService.remove({
                      namespace: entry.namespace,
                      cron_job: entry.name,
                    }),
                  ),
                ).then(() => invalidate(["cron-jobs"]));
              },
            },
          ]}
        />
      </div>
    </PanelPage>
  );
}
