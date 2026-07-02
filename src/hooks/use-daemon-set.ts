import { useSearchParams } from "react-router-dom";
import daemonSetService from "@/api/services/daemon-set-service.ts";
import { useAgentQuery } from "@/hooks/use-agent-query.ts";

export default function useDaemonSet() {
  const [searchParams] = useSearchParams();
  const queryDaemonSet = searchParams.get("daemon-set") || "";
  const queryNamespace = searchParams.get("namespace") || "";
  const { data } = useAgentQuery(
    ["daemon-set", queryNamespace, queryDaemonSet],
    () =>
      daemonSetService.find({
        namespace: queryNamespace,
        daemon_set: queryDaemonSet,
      }),
    { enabled: queryDaemonSet !== "" },
  );
  return data?.daemon_set ?? null;
}
