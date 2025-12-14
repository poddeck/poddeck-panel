import PanelPage from "@/layouts/panel"
import OverviewStatusBox from "@/pages/panel/overview/status.tsx";
import OverviewWorkloadBox from "@/pages/panel/overview/workload.tsx";
import OverviewLocationBox from "@/pages/panel/overview/location.tsx";
import OverviewActivityBox from "@/pages/panel/overview/activity.tsx";

export default function OverviewPage() {
  return (
    <PanelPage title="panel.page.overview.title" layout={false}>
      <div className="w-[min(1800px,95%)] mx-auto flex flex-col flex-1 mt-[4vh]">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-6">
            <OverviewStatusBox/>
            <OverviewWorkloadBox/>
            <OverviewActivityBox/>
          </div>
          <div className="grid auto-rows-min gap-4">
            <OverviewLocationBox/>
          </div>
        </div>
      </div>
    </PanelPage>
  )
}
