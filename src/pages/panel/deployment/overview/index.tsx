import PanelPage from "@/layouts/panel"
import DeploymentPageBreadcrumb from "@/pages/panel/deployment/breadcrumb.tsx";
import DeploymentPageHeader from "@/pages/panel/deployment/header.tsx";
import useDeployment from "@/hooks/use-deployment";
import DeploymentOverviewGeneral from "./general.tsx";
import DeploymentOverviewReplicas from "./replicas.tsx";
import DeploymentOverviewContainer from "./container.tsx";
import DeploymentOverviewConditions from "./conditions.tsx";
import DeploymentOverviewEvents from "./events.tsx";

export default function DeploymentOverviewPage() {
  const deployment = useDeployment();
  return (
    <PanelPage breadcrumb={DeploymentPageBreadcrumb()} layout={false}>
      <DeploymentPageHeader deployment={deployment} page="overview"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          <DeploymentOverviewGeneral deployment={deployment}/>
          <DeploymentOverviewReplicas deployment={deployment}/>
          <DeploymentOverviewContainer deployment={deployment}/>
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-2">
          <DeploymentOverviewConditions deployment={deployment}/>
          <DeploymentOverviewEvents deployment={deployment}/>
        </div>
      </div>
    </PanelPage>
  )
}
