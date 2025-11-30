import PanelPage from "@/layouts/panel"
import PodPageBreadcrumb from "@/pages/panel/pod/breadcrumb.tsx";
import PodPageHeader from "@/pages/panel/pod/header.tsx";
import usePod from "@/hooks/use-pod.ts";

export default function PodContainerPage() {
  const pod = usePod();
  return (
    <PanelPage breadcrumb={PodPageBreadcrumb()} layout={false}>
      <PodPageHeader pod={pod} page="containers"/>
    </PanelPage>
  )
}
