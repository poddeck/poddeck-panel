import { useSearchParams } from "react-router-dom";
import podService from "@/api/services/pod-service.ts";
import { useAgentQuery } from "@/hooks/use-agent-query.ts";

export default function usePod() {
  const [searchParams] = useSearchParams();
  const queryPod = searchParams.get("pod") || "";
  const queryNamespace = searchParams.get("namespace") || "";
  const { data } = useAgentQuery(
    ["pod", queryNamespace, queryPod],
    () => podService.find({ namespace: queryNamespace, pod: queryPod }),
    { enabled: queryPod !== "" },
  );
  return data?.pod ?? null;
}
