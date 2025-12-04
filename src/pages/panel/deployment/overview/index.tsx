import PanelPage from "@/layouts/panel"
import DeploymentPageBreadcrumb from "@/pages/panel/deployment/breadcrumb.tsx";
import DeploymentPageHeader from "@/pages/panel/deployment/header.tsx";
import useDeployment from "@/hooks/use-deployment";
import DeploymentOverviewGeneral
  from "@/pages/panel/deployment/overview/general.tsx";
import DeploymentOverviewReplicas
  from "@/pages/panel/deployment/overview/replicas.tsx";
import DeploymentOverviewEvents
  from "@/pages/panel/deployment/overview/events.tsx";

export default function DeploymentOverviewPage() {
  const deployment = useDeployment();
  return (
    <PanelPage breadcrumb={DeploymentPageBreadcrumb()} layout={false}>
      <DeploymentPageHeader deployment={deployment} page="overview"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          <DeploymentOverviewGeneral deployment={deployment}/>
          <DeploymentOverviewReplicas deployment={deployment}/>
          <DeploymentOverviewGeneral deployment={deployment}/>
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-2">
          <DeploymentOverviewEvents deployment={deployment}/>
        </div>
      </div>
    </PanelPage>
  )
}
