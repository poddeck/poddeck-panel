import { AppHeader } from "@/layouts/panel/header";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import React from "react";
import ClusterService, {
  type Cluster,
} from "@/api/services/cluster-service.ts";
import { useAgentQuery } from "@/hooks/use-agent-query";
import useClusterStore, { useClusterActions } from "@/store/cluster-store.ts";
import { useRouter } from "@/routes/hooks";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import ClusterAddDialog from "@/layouts/panel/sidebar/cluster/add-dialog.tsx";
import ClusterEditDialog from "@/layouts/panel/sidebar/cluster/edit-dialog.tsx";
import ClusterDeleteDialog from "@/layouts/panel/sidebar/cluster/delete-dialog.tsx";
import NodeService, { type Node } from "@/api/services/node-service.ts";
import PodService, { type Pod } from "@/api/services/pod-service.ts";
import DeploymentService, {
  type Deployment,
} from "@/api/services/deployment-service.ts";
import NamespaceService, {
  type Namespace,
} from "@/api/services/namespace-service.ts";
import ClusterCardSkeleton from "@/pages/panel/cluster/skeleton.tsx";
import { ClusterCard } from "@/pages/panel/cluster/card.tsx";
import { useTranslation } from "react-i18next";
import NotificationService, {
  type Notification,
} from "@/api/services/notification-service.ts";
import ServiceService, {
  type Service,
} from "@/api/services/service-service.ts";

export type ExtendedCluster = Cluster & {
  nodes: Node[];
  pods: Pod[];
  deployments: Deployment[];
  namespaces: Namespace[];
  notifications: Notification[];
  services: Service[];
};

export default function ClusterPage() {
  const { t } = useTranslation();
  const [dialogMode, setDialogMode] = React.useState("add");
  const [clickedCluster, setClickedCluster] = React.useState<Cluster | null>(
    null,
  );
  const [open, setOpen] = React.useState(false);
  const { setClusterId } = useClusterActions();
  const currentClusterId = useClusterStore((state) => state.clusterId);
  const { push, replace } = useRouter();

  // The full per-cluster fan-out (pods, deployments, namespaces, ...) is
  // fetched once; only the node lists are polled, matching the previous
  // behavior of this page.
  const clustersQuery = useAgentQuery(
    ["clusters", "extended"],
    async () => {
      const clusterRes = await ClusterService.list();
      const rawClusters = clusterRes.clusters;

      const extended = await Promise.all(
        rawClusters.map(async (cluster) => {
          const nodeResponse = await NodeService.listCluster(cluster.id);
          const podResponse = await PodService.listCluster(cluster.id);
          const deployResponse = await DeploymentService.listCluster(
            cluster.id,
          );
          const namespaceResponse = await NamespaceService.listCluster(
            cluster.id,
          );
          const notificationResponse =
            await NotificationService.listSpecificCluster(cluster.id);
          const serviceResponse = await ServiceService.listCluster(cluster.id);
          return {
            ...cluster,
            nodes: nodeResponse.nodes ?? [],
            pods: podResponse.pods ?? [],
            deployments: deployResponse.deployments ?? [],
            namespaces: namespaceResponse.namespaces ?? [],
            notifications:
              notificationResponse.notifications.filter(
                (n) => n.state !== "SEEN",
              ) ?? [],
            services: serviceResponse.services ?? [],
          };
        }),
      );

      return { clusters: extended satisfies ExtendedCluster[] };
    },
    { pollInterval: false },
  );

  const clusterIds = (clustersQuery.data?.clusters ?? []).map(
    (cluster) => cluster.id,
  );
  const nodesQuery = useAgentQuery(
    ["clusters", "nodes", clusterIds],
    async () => {
      const entries = await Promise.all(
        clusterIds.map(async (id) => {
          const nodeResponse = await NodeService.listCluster(id);
          return [id, nodeResponse.nodes] as const;
        }),
      );
      return { nodesByCluster: Object.fromEntries(entries) };
    },
    { enabled: clusterIds.length > 0 },
  );

  const loading = clustersQuery.isLoading;
  const clusters = React.useMemo(() => {
    const nodesByCluster = nodesQuery.data?.nodesByCluster;
    return (clustersQuery.data?.clusters ?? []).map((cluster) => ({
      ...cluster,
      nodes: nodesByCluster?.[cluster.id] ?? cluster.nodes,
    }));
  }, [clustersQuery.data, nodesQuery.data]);

  const sortedClusters = React.useMemo(() => {
    if (!currentClusterId) return clusters;

    return [...clusters].sort((a, b) => {
      if (a.id === currentClusterId) return -1;
      if (b.id === currentClusterId) return 1;
      return 0;
    });
  }, [clusters, currentClusterId]);

  function clickCluster(cluster: Cluster) {
    setClusterId(cluster.id);
    push("/overview/");
  }

  const handleClusterCreation = () => {
    replace("/overview/");
  };

  return (
    <SidebarProvider>
      <div className="w-full">
        <AppHeader title="panel.page.cluster.title" cluster={false} />
        <Dialog open={open} onOpenChange={setOpen}>
          <div
            className={
              "w-[min(1350px,95%)] mx-auto flex flex-wrap gap-4 flex-col flex-1"
            }
          >
            <div className="grid grid-cols-2 gap-8 my-[4vh]">
              {loading ? (
                <>
                  <ClusterCardSkeleton />
                </>
              ) : (
                <>
                  {sortedClusters.map((cluster) => (
                    <ClusterCard
                      key={cluster.id}
                      cluster={cluster}
                      onClick={() => clickCluster(cluster)}
                      setClickedCluster={setClickedCluster}
                      setDialogMode={setDialogMode}
                    />
                  ))}
                </>
              )}
              <DialogTrigger asChild>
                <div className="aspect-video border-2 border-dashed border-zinc-600 rounded-xl p-4 flex justify-center items-center text-zinc-600 cursor-pointer hover:bg-zinc-600/10 hover:text-zinc-500 transition">
                  + {t("panel.page.cluster.add")}
                </div>
              </DialogTrigger>
            </div>
          </div>
          {open && dialogMode === "add" && (
            <ClusterAddDialog onCreation={handleClusterCreation} />
          )}
          {open && dialogMode === "edit" && (
            <ClusterEditDialog
              id={clickedCluster?.id}
              name={clickedCluster?.name}
              icon={clickedCluster?.icon}
            />
          )}
          {open && dialogMode === "delete" && (
            <ClusterDeleteDialog
              id={clickedCluster?.id}
              name={clickedCluster?.name}
            />
          )}
        </Dialog>
      </div>
    </SidebarProvider>
  );
}
