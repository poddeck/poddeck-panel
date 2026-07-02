import { useSearchParams } from "react-router-dom";
import cronJobService from "@/api/services/cron-job-service.ts";
import { useAgentQuery } from "@/hooks/use-agent-query.ts";

export default function useCronJob() {
  const [searchParams] = useSearchParams();
  const queryCronJob = searchParams.get("cron-job") || "";
  const queryNamespace = searchParams.get("namespace") || "";
  const { data } = useAgentQuery(
    ["cron-job", queryNamespace, queryCronJob],
    () =>
      cronJobService.find({
        namespace: queryNamespace,
        cron_job: queryCronJob,
      }),
    { enabled: queryCronJob !== "" },
  );
  return data?.cron_job ?? null;
}
