import {
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { POLL_INTERVAL_MS } from "@/lib/constants.ts";
import { useClusterId } from "@/store/cluster-store.ts";

export class AgentRequestError extends Error {
  constructor() {
    super("The agent reported the request as unsuccessful");
    this.name = "AgentRequestError";
  }
}

export interface UseAgentQueryOptions {
  enabled?: boolean;
  /** Polling interval in ms, or false to disable polling. Defaults to POLL_INTERVAL_MS. */
  pollInterval?: number | false;
}

/**
 * Fetch data from the cluster agent with caching and background polling.
 *
 * Agent requests can be slow, so results are cached per cluster: revisiting
 * a page shows the cached data immediately and revalidates in the background
 * instead of blocking on a fresh fetch. Polling pauses while the tab is
 * hidden. Responses with `success: false` are turned into query errors so
 * pages can render a retry state.
 */
export function useAgentQuery<TResponse extends object>(
  key: QueryKey,
  fetcher: () => Promise<TResponse>,
  { enabled = true, pollInterval = POLL_INTERVAL_MS }: UseAgentQueryOptions = {},
) {
  const clusterId = useClusterId() ?? "default";
  return useQuery({
    queryKey: [clusterId, ...key],
    queryFn: async () => {
      const response = await fetcher();
      if ((response as { success?: boolean }).success === false) {
        throw new AgentRequestError();
      }
      return response;
    },
    enabled,
    refetchInterval: pollInterval,
    // Keep showing the previous page's data while a same-cluster refetch is
    // in flight, but never show one cluster's data under another cluster.
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[0] === clusterId ? previousData : undefined,
  });
}

/**
 * Invalidate cached agent queries for the active cluster, e.g. after a
 * mutation so lists refresh without waiting for the next poll.
 */
export function useInvalidateAgentQuery() {
  const queryClient = useQueryClient();
  const clusterId = useClusterId() ?? "default";
  return (key: QueryKey) =>
    queryClient.invalidateQueries({ queryKey: [clusterId, ...key] });
}
