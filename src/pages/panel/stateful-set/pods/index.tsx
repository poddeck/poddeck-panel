import PanelPage from "@/layouts/panel"
import StatefulSetPageBreadcrumb from "@/pages/panel/stateful-set/breadcrumb.tsx";
import StatefulSetPageHeader from "@/pages/panel/stateful-set/header.tsx";
import useStatefulSet from "@/hooks/use-stateful-set.ts";
import PodsList from "@/pages/panel/pods/list.tsx";

export default function StatefulSetPodsPage() {
  const statefulSet = useStatefulSet();
  return (
    <PanelPage breadcrumb={StatefulSetPageBreadcrumb()} layout={false}>
      <StatefulSetPageHeader statefulSet={statefulSet} page="pods"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <PodsList controller={"StatefulSet/" + statefulSet?.name}/>
      </div>
    </PanelPage>
  )
}
