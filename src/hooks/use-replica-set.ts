import { useSearchParams } from "react-router-dom";
import replicaSetService from "@/api/services/replica-set-service.ts";
import { useAgentQuery } from "@/hooks/use-agent-query.ts";

export default function useReplicaSet() {
  const [searchParams] = useSearchParams();
  const queryReplicaSet = searchParams.get("replica-set") || "";
  const queryNamespace = searchParams.get("namespace") || "";
  const { data } = useAgentQuery(
    ["replica-set", queryNamespace, queryReplicaSet],
    () =>
      replicaSetService.find({
        namespace: queryNamespace,
        replica_set: queryReplicaSet,
      }),
    { enabled: queryReplicaSet !== "" },
  );
  return data?.replica_set ?? null;
}
