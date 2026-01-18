import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import statefulSetService, {type StatefulSet} from "@/api/services/stateful-set-service.ts";

const statefulSetCache: Record<string, StatefulSet> = {};

export default function useStatefulSet() {
  const [statefulSet, setStatefulSet] = useState<StatefulSet | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let isMounted = true;
    const queryStatefulSet = searchParams.get("stateful-set") || "";
    const queryNamespace = searchParams.get("namespace") || "";
    const cacheKey = `${queryNamespace}:${queryStatefulSet}`;

    async function loadStatefulSet() {
      if (statefulSetCache[cacheKey]) {
        setStatefulSet(statefulSetCache[cacheKey]);
      }
      const response = await statefulSetService.find({ namespace: queryNamespace, stateful_set: queryStatefulSet });
      if (response.success && isMounted) {
        statefulSetCache[cacheKey] = response.stateful_set;
        setStatefulSet(response.stateful_set);
      }
    }

    loadStatefulSet();
    const interval = window.setInterval(loadStatefulSet, 1000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [searchParams]);

  return statefulSet;
}
