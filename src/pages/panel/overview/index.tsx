import PanelPage from "@/layouts/panel"
import OverviewStatusBox from "@/pages/panel/overview/status.tsx";
import OverviewWorkloadBox from "@/pages/panel/overview/workload.tsx";
import OverviewLocationBox from "@/pages/panel/overview/location.tsx";
import OverviewActivityBox from "@/pages/panel/overview/activity.tsx";
import OverviewNodesBox from "@/pages/panel/overview/nodes.tsx";
import OverviewNewsBox from "@/pages/panel/overview/news.tsx";
import {startTransition, useEffect, useState} from "react";
import nodeService, {type Node} from "@/api/services/node-service.ts";

export default function OverviewPage() {
  const [nodes, setNodes] = useState <Node[]>([]);

  useEffect(() => {
    async function loadNodes() {
      const response = await nodeService.list();
      if (response.success !== false) {
        startTransition(() => {
          setNodes(response.nodes);
        });
      }
    }
    loadNodes();
    const interval = window.setInterval(loadNodes, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <PanelPage title="panel.page.overview.title" layout={false}>
      <div className="w-[min(1800px,95%)] mx-auto flex flex-col flex-1 mt-[4vh]">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-6">
            <OverviewStatusBox/>
            <OverviewWorkloadBox nodes={nodes}/>
            <OverviewActivityBox/>
          </div>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <OverviewNodesBox nodes={nodes}/>
            <OverviewLocationBox/>
            <OverviewNewsBox/>
          </div>
        </div>
      </div>
    </PanelPage>
  )
}
