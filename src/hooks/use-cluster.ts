import {useCallback, useEffect, useState} from "react";
import ClusterService, {type Cluster} from "@/api/services/cluster-service.ts";

let clusterCache: Cluster[] | null = null;

export function useClusters() {
  const [clusters, _setClusters] = useState<Cluster[]>(clusterCache ?? []);
  const [loading, setLoading] = useState(true);

  const setClusters = useCallback((value: Cluster[] | ((prev: Cluster[]) => Cluster[])) => {
    _setClusters(prev => {
      const next = typeof value === "function" ? value(prev) : value;
      clusterCache = next;
      return next;
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchClusters() {
      setLoading(true);
      try {
        if (clusterCache) {
          setClusters(clusterCache);
        }
        const response = await ClusterService.list();
        if (!isMounted) {
          return;
        }
        setClusters(response.clusters);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchClusters();
    return () => { isMounted = false; };
  }, [setClusters]);

  return { clusters, setClusters, loading };
}
