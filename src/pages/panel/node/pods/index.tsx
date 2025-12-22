import PanelPage from "@/layouts/panel";
import PodsList from "@/pages/panel/pods/list.tsx";
import NodePageBreadcrumb from "@/pages/panel/node/breadcrumb.tsx";
import useNode from "@/hooks/use-node.ts";
import NodePageHeader from "@/pages/panel/node/header.tsx";

export default function NodePodsPage() {
  const node = useNode();
  return (
    <PanelPage breadcrumb={NodePageBreadcrumb()} layout={false}>
      <NodePageHeader node={node} page="pods"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        {node &&
          <PodsList node={node.name}/>
        }
      </div>
    </PanelPage>
  )
}
