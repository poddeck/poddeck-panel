import { useSearchParams } from "react-router-dom";
import nodeService from "@/api/services/node-service.ts";
import { useAgentQuery } from "@/hooks/use-agent-query.ts";

export default function useNode() {
  const [searchParams] = useSearchParams();
  const queryNode = searchParams.get("node") || "";
  const { data } = useAgentQuery(
    ["node", queryNode],
    () => nodeService.find({ name: queryNode }),
    { enabled: queryNode !== "" },
  );
  return data?.node ?? null;
}
