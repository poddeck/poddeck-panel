import PanelPage from "@/layouts/panel"
import ReplicaSetPageBreadcrumb from "@/pages/panel/replica-set/breadcrumb.tsx";
import ReplicaSetPageHeader from "@/pages/panel/replica-set/header.tsx";
import PodsList from "@/pages/panel/pods/list.tsx";
import useReplicaSet from "@/hooks/use-replica-set.ts";

export default function ReplicaSetPodsPage() {
  const replicaSet = useReplicaSet();
  return (
    <PanelPage breadcrumb={ReplicaSetPageBreadcrumb()} layout={false}>
      <ReplicaSetPageHeader replicaSet={replicaSet} page="pods"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <PodsList controller={"ReplicaSet/" + replicaSet?.name}/>
      </div>
    </PanelPage>
  )
}
