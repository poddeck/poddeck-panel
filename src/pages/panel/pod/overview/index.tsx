import PanelPage from "@/layouts/panel"
import PodPageBreadcrumb from "@/pages/panel/pod/breadcrumb.tsx";
import PodPageHeader from "@/pages/panel/pod/header.tsx";
import PodOverviewGeneral from "@/pages/panel/pod/overview/general.tsx";
import PodOverviewStatus from "@/pages/panel/pod/overview/status.tsx";
import PodOverviewNetwork from "@/pages/panel/pod/overview/network.tsx";
import PodOverviewContainers from "@/pages/panel/pod/overview/containers.tsx";
import PodOverviewEvents from "@/pages/panel/pod/overview/events.tsx";
import usePod from "@/hooks/use-pod.ts";

export default function PodOverviewPage() {
  const pod = usePod();
  return (
    <PanelPage breadcrumb={PodPageBreadcrumb()} layout={false}>
      <PodPageHeader pod={pod} page="overview"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          <PodOverviewGeneral pod={pod}/>
          <PodOverviewStatus pod={pod}/>
          <PodOverviewNetwork pod={pod}/>
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-2">
          <PodOverviewContainers pod={pod}/>
          <PodOverviewEvents pod={pod}/>
        </div>
      </div>
    </PanelPage>
  )
}
