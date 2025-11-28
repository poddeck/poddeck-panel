import PanelPage from "@/layouts/panel"
import PodPageBreadcrumb from "@/pages/panel/pod/breadcrumb.tsx";
import PodPageHeader from "@/pages/panel/pod/header.tsx";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import podService, {type Pod} from "@/api/services/pod-service.ts";
import {
  CalendarClock,
} from "lucide-react";
import {useTranslation} from "react-i18next";
import PodOverviewGeneral from "@/pages/panel/pod/overview/general.tsx";
import PodOverviewStatus from "@/pages/panel/pod/overview/status.tsx";
import PodOverviewNetwork from "@/pages/panel/pod/overview/network.tsx";
import PodOverviewContainers from "@/pages/panel/pod/overview/containers.tsx";

export default function PodOverviewPage() {
  const {t} = useTranslation();
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
      <PodPageHeader pod={pod} page="overview"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          <PodOverviewGeneral pod={pod}/>
          <PodOverviewStatus pod={pod}/>
          <PodOverviewNetwork pod={pod}/>
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-2">
          <PodOverviewContainers pod={pod}/>
          <div className="bg-sidebar aspect-video rounded-xl p-8">
            <span className="flex items-center gap-3 text-xl mb-5"><CalendarClock size={20}/> {t("panel.page.pod.overview.events.title")}</span>
          </div>
        </div>
      </div>
    </PanelPage>
  )
}
