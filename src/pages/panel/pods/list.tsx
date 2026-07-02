import { Box, Trash2 } from "lucide-react";
import { DataTable } from "@/components/table";
import { useState } from "react";
import namespaceService from "@/api/services/namespace-service.ts";
import { useRouter } from "@/routes/hooks";
import { useTranslation } from "react-i18next";
import podService, { type Pod } from "@/api/services/pod-service";
import { columns } from "./table-columns";
import {
  useAgentQuery,
  useInvalidateAgentQuery,
} from "@/hooks/use-agent-query";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

function PodListEmpty() {
  const { t } = useTranslation();
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Box />
        </EmptyMedia>
        <EmptyTitle>{t("panel.page.pods.empty.title")}</EmptyTitle>
        <EmptyDescription>
          {t("panel.page.pods.empty.description")}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default function PodsList({
  controller,
  node,
}: {
  controller?: string;
  node?: string;
}) {
  const { t } = useTranslation();
  const { push } = useRouter();
  const invalidate = useInvalidateAgentQuery();
  const [pendingDelete, setPendingDelete] = useState<Pod[]>([]);

  const podsQuery = useAgentQuery(["pods"], podService.list);
  const namespacesQuery = useAgentQuery(["namespaces"], namespaceService.list);
  const pods = podsQuery.data?.pods ?? [];
  const namespaces = namespacesQuery.data?.namespaces ?? [];

  async function deletePods(entries: Pod[]) {
    const results = await Promise.allSettled(
      entries.map((pod) =>
        podService.remove({ namespace: pod.namespace, pod: pod.name }),
      ),
    );
    const failed = results.filter(
      (result) =>
        result.status === "rejected" || result.value.success === false,
    ).length;
    const deleted = entries.length - failed;
    if (deleted > 0) {
      toast.success(
        t("panel.page.pods.delete.bulk.toast.success", { count: deleted }),
      );
    }
    if (failed > 0) {
      toast.error(
        t("panel.page.pods.delete.bulk.toast.error", { count: failed }),
      );
    }
    invalidate(["pods"]);
  }

  const defaultFilters = {
    ...(controller && { controlled_by: controller }),
    ...(node && { node }),
  };
  if (!podsQuery.isLoading && !podsQuery.isError && pods.length === 0) {
    return <PodListEmpty />;
  }
  return (
    <>
      <DataTable<Pod>
        name="pods"
        columns={columns}
        data={pods}
        pageSize={5}
        initialSorting={[{ id: "namespace", desc: false }]}
        isLoading={podsQuery.isLoading}
        isFetching={podsQuery.isFetching}
        isError={podsQuery.isError}
        onRetry={() => podsQuery.refetch()}
        visibilityState={{ node: false, pod_ip: false, controlled_by: false }}
        filters={[
          {
            column: "namespace",
            options: namespaces.map((namespace) => namespace.name),
          },
        ]}
        defaultFilters={defaultFilters}
        onClick={(pod) =>
          push("/pod/overview/?pod=" + pod.name + "&namespace=" + pod.namespace)
        }
        bulkActions={[
          {
            name: "panel.page.pods.action.delete",
            icon: Trash2,
            onClick: (entries) => setPendingDelete(entries),
          },
        ]}
      />
      <AlertDialog
        open={pendingDelete.length > 0}
        onOpenChange={(open) => {
          if (!open) setPendingDelete([]);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("panel.page.pods.delete.bulk.title", {
                count: pendingDelete.length,
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("panel.page.pods.delete.bulk.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("panel.page.pods.delete.bulk.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => {
                const entries = pendingDelete;
                setPendingDelete([]);
                deletePods(entries);
              }}
            >
              {t("panel.page.pods.delete.bulk.submit")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
