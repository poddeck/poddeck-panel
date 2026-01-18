import PanelPage from "@/layouts/panel"
import StatefulSetPageBreadcrumb from "@/pages/panel/stateful-set/breadcrumb.tsx";
import StatefulSetPageHeader from "@/pages/panel/stateful-set/header.tsx";
import useStatefulSet from "@/hooks/use-stateful-set.ts";
import StatefulSetOverviewGeneral from "./general.tsx";
import StatefulSetOverviewReplicas from "./replicas.tsx";
import StatefulSetOverviewContainer from "./container.tsx";
import StatefulSetOverviewConditions from "./conditions.tsx";
import StatefulSetOverviewEvents from "./events.tsx";

export default function StatefulSetOverviewPage() {
  const statefulSet = useStatefulSet();
  return (
    <PanelPage breadcrumb={StatefulSetPageBreadcrumb()} layout={false}>
      <StatefulSetPageHeader statefulSet={statefulSet} page="overview"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          <StatefulSetOverviewGeneral statefulSet={statefulSet}/>
          <StatefulSetOverviewReplicas statefulSet={statefulSet}/>
          <StatefulSetOverviewContainer statefulSet={statefulSet}/>
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-2">
          <StatefulSetOverviewConditions statefulSet={statefulSet}/>
          <StatefulSetOverviewEvents statefulSet={statefulSet}/>
        </div>
      </div>
    </PanelPage>
  )
}
