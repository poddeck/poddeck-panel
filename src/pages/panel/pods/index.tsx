import PanelPage from "@/layouts/panel";
import PodsList from "@/pages/panel/pods/list.tsx";

export default function PodsPage() {
  return (
    <PanelPage title="panel.page.pods.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
        </div>
        <PodsList/>
      </div>
    </PanelPage>
  )
}
