import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import cronJobService, {type CronJob} from "@/api/services/cron-job-service.ts";

const cronJobCache: Record<string, CronJob> = {};

export default function useCronJob() {
  const [cronJob, setCronJob] = useState<CronJob | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let isMounted = true;
    const queryCronJob = searchParams.get("cron-job") || "";
    const queryNamespace = searchParams.get("namespace") || "";
    const cacheKey = `${queryNamespace}:${queryCronJob}`;

    async function loadCronJob() {
      if (cronJobCache[cacheKey]) {
        setCronJob(cronJobCache[cacheKey]);
      }
      const response = await cronJobService.find({ namespace: queryNamespace, cron_job: queryCronJob });
      if (response.success && isMounted) {
        cronJobCache[cacheKey] = response.cron_job;
        setCronJob(response.cron_job);
      }
    }

    loadCronJob();
    const interval = window.setInterval(loadCronJob, 1000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [searchParams]);

  return cronJob;
}
