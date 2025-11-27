import PanelPage from "@/layouts/panel"
import PodPageBreadcrumb from "@/pages/panel/pod/breadcrumb.tsx";
import PodPageHeader from "@/pages/panel/pod/header.tsx";
import {useEffect, useState} from "react";
import podService, {type Pod} from "@/api/services/pod-service.ts";
import {useSearchParams} from "react-router-dom";

export default function PodEventsPage() {
  const [pod, setPod] = useState<Pod | null>(null);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    async function loadPod() {
      const response = await podService.list();
      if (response.success != false) {
        const podFromQuery = searchParams.get("pod");
        const pod = response.pods.filter(entry => entry.name === podFromQuery);
        if (pod.length > 0) {
          setPod(pod[0]);
        }
      }
    }
    loadPod();
    const interval = window.setInterval(loadPod, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <PanelPage breadcrumb={PodPageBreadcrumb()} layout={false}>
      <PodPageHeader pod={pod} page="events"/>
    </PanelPage>
  )
}
