import {AppHeader} from "@/layouts/panel/header";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import React, {useEffect, useState} from "react";
import ClusterService, {type Cluster} from "@/api/services/cluster-service.ts";
import {useClusterActions} from "@/store/cluster-store.ts";
import {useRouter} from "@/routes/hooks";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import ClusterAddDialog from "@/layouts/panel/sidebar/cluster/add-dialog.tsx";
import ClusterEditDialog from "@/layouts/panel/sidebar/cluster/edit-dialog.tsx";
import ClusterDeleteDialog
  from "@/layouts/panel/sidebar/cluster/delete-dialog.tsx";
import NodeService, {type Node} from "@/api/services/node-service.ts";
import PodService, {type Pod} from "@/api/services/pod-service.ts";
import DeploymentService, {
  type Deployment
} from "@/api/services/deployment-service.ts";
import NamespaceService, {
  type Namespace
} from "@/api/services/namespace-service.ts";
import ClusterCardSkeleton from "@/pages/panel/cluster/skeleton.tsx";
import {ClusterCard} from "@/pages/panel/cluster/card.tsx";

export type ExtendedCluster = Cluster & {
  nodes: Node[],
  pods: Pod[],
  deployments: Deployment[],
  namespaces: Namespace[]
};

export default function ClusterPage() {
  const [clusters, setClusters] = useState<ExtendedCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogMode, setDialogMode] = React.useState("add");
  const [clickedCluster, setClickedCluster] = React.useState<Cluster | null>(null);
  const [open, setOpen] = React.useState(false);
  const {setClusterId} = useClusterActions();
  const {replace} = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clusterRes = await ClusterService.list();
        const rawClusters = clusterRes.clusters;

        const extended = await Promise.all(
          rawClusters.map(async (cluster) => {
            const nodeResponse = await NodeService.listCluster(cluster.id);
            const podResponse = await PodService.listCluster(cluster.id);
            const deployResponse = await DeploymentService.listCluster(cluster.id);
            const namespaceResponse = await NamespaceService.listCluster(cluster.id);
            return {
              ...cluster,
              nodes: nodeResponse.nodes ?? [],
              pods: podResponse.pods ?? [],
              deployments: deployResponse.deployments ?? [],
              namespaces: namespaceResponse.namespaces ?? []
            };
          })
        );

        setClusters(extended);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (clusters.length === 0) {
      return;
    }
    const interval = setInterval(async () => {
      const updatedClusters = await Promise.all(
        clusters.map(async (cluster) => {
          const nodeResponse = await NodeService.listCluster(cluster.id);
          return {
            ...cluster,
            nodes: nodeResponse.nodes ?? cluster.nodes
          };
        })
      );
      setClusters(updatedClusters);
    }, 1000);

    return () => clearInterval(interval);
  }, [clusters]);

  function clickCluster(cluster: Cluster) {
    setClusterId(cluster.id);
    replace("/overview/");
  }

  const handleClusterCreation = () => {
    replace("/overview/");
  };

  return (
    <SidebarProvider>
      <div className="w-full">
        <AppHeader title="panel.page.cluster.title" sidebar={false}/>
        <Dialog open={open} onOpenChange={setOpen}>
          <div
            className={"w-[min(1350px,95%)] mx-auto flex flex-wrap gap-4 flex-col flex-1"}>
            <div className="grid grid-cols-2 gap-8 my-[4vh]">
              {loading ? (
                <>
                  <ClusterCardSkeleton/>
                </>
              ) : (
                <>
                  {clusters.map(cluster => (
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
                <div
                  className="aspect-video border-2 border-dashed border-zinc-600 rounded-xl p-4 flex justify-center items-center text-zinc-600 cursor-pointer hover:bg-zinc-600/10 hover:text-zinc-500 transition">
                  + Neues Projekt
                </div>
              </DialogTrigger>
            </div>
          </div>
          {open && dialogMode === "add" && (
            <ClusterAddDialog
              onCreation={handleClusterCreation}
            />
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
  )
}
