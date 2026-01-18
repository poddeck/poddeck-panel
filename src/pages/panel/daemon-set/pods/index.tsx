import PanelPage from "@/layouts/panel"
import DaemonSetPageBreadcrumb from "@/pages/panel/daemon-set/breadcrumb.tsx";
import DaemonSetPageHeader from "@/pages/panel/daemon-set/header.tsx";
import useDaemonSet from "@/hooks/use-daemon-set";
import PodsList from "@/pages/panel/pods/list.tsx";

export default function DaemonSetPodsPage() {
  const daemonSet = useDaemonSet();
  return (
    <PanelPage breadcrumb={DaemonSetPageBreadcrumb()} layout={false}>
      <DaemonSetPageHeader daemonSet={daemonSet} page="pods"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <PodsList controller={"DaemonSet/" + daemonSet?.name}/>
      </div>
    </PanelPage>
  )
}
