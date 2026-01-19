import PanelPage from "@/layouts/panel"
import CronJobPageBreadcrumb from "@/pages/panel/cron-job/breadcrumb.tsx";
import CronJobPageHeader from "@/pages/panel/cron-job/header.tsx";
import useCronJob from "@/hooks/use-cron-job";
import CronJobOverviewGeneral from "./general.tsx";
import CronJobOverviewEvents from "./events.tsx";
import CronJobOverviewLimits from "@/pages/panel/cron-job/overview/limits.tsx";
import CronJobOverviewSchedule
  from "@/pages/panel/cron-job/overview/schedule.tsx";

export default function CronJobOverviewPage() {
  const cronJob = useCronJob();
  return (
    <PanelPage breadcrumb={CronJobPageBreadcrumb()} layout={false}>
      <CronJobPageHeader cronJob={cronJob} page="overview"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          <CronJobOverviewGeneral cronJob={cronJob}/>
          <CronJobOverviewSchedule cronJob={cronJob}/>
          <CronJobOverviewLimits cronJob={cronJob}/>
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-1">
          <CronJobOverviewEvents cronJob={cronJob}/>
        </div>
      </div>
    </PanelPage>
  )
}
