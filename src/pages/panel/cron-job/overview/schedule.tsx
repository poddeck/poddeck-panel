import {ClipboardClock} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {CronJob} from "@/api/services/cron-job-service.ts";

export default function CronJobOverviewSchedule(
  {
    cronJob
  }: {
    cronJob: CronJob | null
  }
) {
  const {t} = useTranslation();
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center gap-3 text-xl mb-5">
        <ClipboardClock size={20}/> {t("panel.page.cron-job.overview.schedule.title")}
      </span>
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.cron-job.overview.schedule.schedule")}</span>
          <span>{cronJob?.schedule}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.cron-job.overview.schedule.timezone")}</span>
          <span>{cronJob?.time_zone}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.cron-job.overview.schedule.active")}</span>
          <span>{cronJob?.active}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.cron-job.overview.schedule.last.schedule")}</span>
          <span>{cronJob ? new Date(cronJob.last_schedule_time).toLocaleString() : ""}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.cron-job.overview.schedule.last.successful")}</span>
          <span>{cronJob ? new Date(cronJob.last_successful_time).toLocaleString() : ""}</span>
        </div>
      </div>
    </div>
  );
}