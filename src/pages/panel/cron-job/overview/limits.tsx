import {Hash} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {CronJob} from "@/api/services/cron-job-service.ts";

export default function CronJobOverviewLimits(
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
        <Hash size={20}/> {t("panel.page.cron-job.overview.limits.title")}
      </span>
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.cron-job.overview.limits.concurrency.policy")}</span>
          <span>{cronJob?.concurrency_policy}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.cron-job.overview.limits.successful.jobs.history.limit")}</span>
          <span>{cronJob?.successful_jobs_history_limit}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span
            className="text-primary/60">{t("panel.page.cron-job.overview.limits.failed.jobs.history.limit")}</span>
          <span>{cronJob?.failed_jobs_history_limit}</span>
        </div>
      </div>
    </div>
  );
}