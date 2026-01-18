import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import replicaSetService, {type ReplicaSet} from "@/api/services/replica-set-service.ts";

const replicaSetCache: Record<string, ReplicaSet> = {};

export default function useReplicaSet() {
  const [replicaSet, setReplicaSet] = useState<ReplicaSet | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let isMounted = true;
    const queryReplicaSet = searchParams.get("replica-set") || "";
    const queryNamespace = searchParams.get("namespace") || "";
    const cacheKey = `${queryNamespace}:${queryReplicaSet}`;

    async function loadReplicaSet() {
      if (replicaSetCache[cacheKey]) {
        setReplicaSet(replicaSetCache[cacheKey]);
      }
      const response = await replicaSetService.find({ namespace: queryNamespace, replica_set: queryReplicaSet });
      if (response.success && isMounted) {
        replicaSetCache[cacheKey] = response.replica_set;
        setReplicaSet(response.replica_set);
      }
    }

    loadReplicaSet();
    const interval = window.setInterval(loadReplicaSet, 1000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [searchParams]);

  return replicaSet;
}
