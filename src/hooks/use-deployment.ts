import { useSearchParams } from "react-router-dom";
import deploymentService from "@/api/services/deployment-service.ts";
import { useAgentQuery } from "@/hooks/use-agent-query.ts";

export default function useDeployment() {
  const [searchParams] = useSearchParams();
  const queryDeployment = searchParams.get("deployment") || "";
  const queryNamespace = searchParams.get("namespace") || "";
  const { data } = useAgentQuery(
    ["deployment", queryNamespace, queryDeployment],
    () =>
      deploymentService.find({
        namespace: queryNamespace,
        deployment: queryDeployment,
      }),
    { enabled: queryDeployment !== "" },
  );
  return data?.deployment ?? null;
}
