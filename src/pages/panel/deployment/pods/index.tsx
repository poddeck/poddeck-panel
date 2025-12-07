import PanelPage from "@/layouts/panel"
import DeploymentPageBreadcrumb from "@/pages/panel/deployment/breadcrumb.tsx";
import DeploymentPageHeader from "@/pages/panel/deployment/header.tsx";
import useDeployment from "@/hooks/use-deployment";
import PodsList from "@/pages/panel/pods/list.tsx";

export default function DeploymentPodsPage() {
  const deployment = useDeployment();
  return (
    <PanelPage breadcrumb={DeploymentPageBreadcrumb()} layout={false}>
      <DeploymentPageHeader deployment={deployment} page="pods"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <PodsList controller={"ReplicaSet/" + deployment?.replica_set}/>
      </div>
    </PanelPage>
  )
}
