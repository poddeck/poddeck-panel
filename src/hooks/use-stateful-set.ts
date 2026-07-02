import { useSearchParams } from "react-router-dom";
import statefulSetService from "@/api/services/stateful-set-service.ts";
import { useAgentQuery } from "@/hooks/use-agent-query.ts";

export default function useStatefulSet() {
  const [searchParams] = useSearchParams();
  const queryStatefulSet = searchParams.get("stateful-set") || "";
  const queryNamespace = searchParams.get("namespace") || "";
  const { data } = useAgentQuery(
    ["stateful-set", queryNamespace, queryStatefulSet],
    () =>
      statefulSetService.find({
        namespace: queryNamespace,
        stateful_set: queryStatefulSet,
      }),
    { enabled: queryStatefulSet !== "" },
  );
  return data?.stateful_set ?? null;
}
