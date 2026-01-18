import PanelPage from "@/layouts/panel"
import DaemonSetPageBreadcrumb from "@/pages/panel/daemon-set/breadcrumb.tsx";
import DaemonSetPageHeader from "@/pages/panel/daemon-set/header.tsx";
import useDaemonSet from "@/hooks/use-daemon-set";
import DaemonSetOverviewGeneral from "./general.tsx";
import DaemonSetOverviewReplicas from "./replicas.tsx";
import DaemonSetOverviewContainer from "./container.tsx";
import DaemonSetOverviewConditions from "./conditions.tsx";
import DaemonSetOverviewEvents from "./events.tsx";

export default function DaemonSetOverviewPage() {
  const daemonSet = useDaemonSet();
  return (
    <PanelPage breadcrumb={DaemonSetPageBreadcrumb()} layout={false}>
      <DaemonSetPageHeader daemonSet={daemonSet} page="overview"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          <DaemonSetOverviewGeneral daemonSet={daemonSet}/>
          <DaemonSetOverviewReplicas daemonSet={daemonSet}/>
          <DaemonSetOverviewContainer daemonSet={daemonSet}/>
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-2">
          <DaemonSetOverviewConditions daemonSet={daemonSet}/>
          <DaemonSetOverviewEvents daemonSet={daemonSet}/>
        </div>
      </div>
    </PanelPage>
  )
}
