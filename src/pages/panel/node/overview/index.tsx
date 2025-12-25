import PanelPage from "@/layouts/panel"
import NodePageBreadcrumb from "@/pages/panel/node/breadcrumb.tsx";
import NodePageHeader from "@/pages/panel/node/header.tsx";
import useNode from "@/hooks/use-node";
import NodeOverviewEvents from "@/pages/panel/node/overview/events.tsx";
import NodeOverviewConditions from "@/pages/panel/node/overview/conditions.tsx";
import NodeOverviewGeneral from "@/pages/panel/node/overview/general.tsx";
import NodeOverviewCapacity from "@/pages/panel/node/overview/capacity.tsx";
import NodeOverviewPlatform from "@/pages/panel/node/overview/platform.tsx";

export default function NodeOverviewPage() {
  const node = useNode();
  return (
    <PanelPage breadcrumb={NodePageBreadcrumb()} layout={false}>
      <NodePageHeader node={node} page="overview"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          <NodeOverviewGeneral node={node}/>
          <NodeOverviewPlatform node={node}/>
          <NodeOverviewCapacity node={node}/>
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-2">
          <NodeOverviewConditions node={node}/>
          <NodeOverviewEvents node={node}/>
        </div>
      </div>
    </PanelPage>
  )
}
