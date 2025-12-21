import PanelPage from "@/layouts/panel"
import NodePageBreadcrumb from "@/pages/panel/node/breadcrumb.tsx";
import NodePageHeader from "@/pages/panel/node/header.tsx";
import useNode from "@/hooks/use-node";
import NodeOverviewGeneral from "./general.tsx";
import NodeOverviewReplicas from "./replicas.tsx";
import NodeOverviewContainer from "./container.tsx";
import NodeOverviewConditions from "./conditions.tsx";
import NodeOverviewEvents from "./events.tsx";

export default function NodeOverviewPage() {
  const node = useNode();
  return (
    <PanelPage breadcrumb={NodePageBreadcrumb()} layout={false}>
      <NodePageHeader node={node} page="overview"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          <NodeOverviewGeneral node={node}/>
          <NodeOverviewReplicas node={node}/>
          <NodeOverviewContainer node={node}/>
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-2">
          <NodeOverviewConditions node={node}/>
          <NodeOverviewEvents node={node}/>
        </div>
      </div>
    </PanelPage>
  )
}
