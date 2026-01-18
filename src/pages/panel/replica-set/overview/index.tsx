import PanelPage from "@/layouts/panel"
import ReplicaSetPageBreadcrumb from "@/pages/panel/replica-set/breadcrumb.tsx";
import ReplicaSetPageHeader from "@/pages/panel/replica-set/header.tsx";
import useReplicaSet from "@/hooks/use-replica-set.ts";
import ReplicaSetOverviewGeneral from "./general.tsx";
import ReplicaSetOverviewReplicas from "./replicas.tsx";
import ReplicaSetOverviewContainer from "./container.tsx";
import ReplicaSetOverviewConditions from "./conditions.tsx";
import ReplicaSetOverviewEvents from "./events.tsx";

export default function ReplicaSetOverviewPage() {
  const replicaSet = useReplicaSet();
  return (
    <PanelPage breadcrumb={ReplicaSetPageBreadcrumb()} layout={false}>
      <ReplicaSetPageHeader replicaSet={replicaSet} page="overview"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          <ReplicaSetOverviewGeneral replicaSet={replicaSet}/>
          <ReplicaSetOverviewReplicas replicaSet={replicaSet}/>
          <ReplicaSetOverviewContainer replicaSet={replicaSet}/>
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-2">
          <ReplicaSetOverviewConditions replicaSet={replicaSet}/>
          <ReplicaSetOverviewEvents replicaSet={replicaSet}/>
        </div>
      </div>
    </PanelPage>
  )
}
