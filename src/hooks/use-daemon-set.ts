import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import daemonSetService, {type DaemonSet} from "@/api/services/daemon-set-service.ts";

const daemonSetCache: Record<string, DaemonSet> = {};

export default function useDaemonSet() {
  const [daemonSet, setDaemonSet] = useState<DaemonSet | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let isMounted = true;
    const queryDaemonSet = searchParams.get("daemon-set") || "";
    const queryNamespace = searchParams.get("namespace") || "";
    const cacheKey = `${queryNamespace}:${queryDaemonSet}`;

    async function loadDaemonSet() {
      if (daemonSetCache[cacheKey]) {
        setDaemonSet(daemonSetCache[cacheKey]);
      }
      const response = await daemonSetService.find({ namespace: queryNamespace, daemon_set: queryDaemonSet });
      if (response.success && isMounted) {
        daemonSetCache[cacheKey] = response.daemon_set;
        setDaemonSet(response.daemon_set);
      }
    }

    loadDaemonSet();
    const interval = window.setInterval(loadDaemonSet, 1000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [searchParams]);

  return daemonSet;
}
