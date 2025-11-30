import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import podService, {type Pod} from "@/api/services/pod-service.ts";

const podCache: Record<string, Pod> = {};

export default function usePod() {
  const [pod, setPod] = useState<Pod | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let isMounted = true;
    const queryPod = searchParams.get("pod") || "";
    const queryNamespace = searchParams.get("namespace") || "";
    const cacheKey = `${queryNamespace}:${queryPod}`;

    async function loadPod() {
      if (podCache[cacheKey]) {
        setPod(podCache[cacheKey]);
      }
      const response = await podService.find({ namespace: queryNamespace, pod: queryPod });
      if (response.success && isMounted) {
        podCache[cacheKey] = response.pod;
        setPod(response.pod);
      }
    }

    loadPod();
    const interval = window.setInterval(loadPod, 1000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [searchParams]);

  return pod;
}
