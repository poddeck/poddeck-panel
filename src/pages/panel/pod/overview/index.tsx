import PanelPage from "@/layouts/panel"
import PodPageBreadcrumb from "@/pages/panel/pod/breadcrumb.tsx";
import PodPageHeader from "@/pages/panel/pod/header.tsx";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import podService, {type Pod} from "@/api/services/pod-service.ts";
import {
  Bolt, CalendarClock,
  Container,
  Lightbulb,
  Network,
} from "lucide-react";
import {useTranslation} from "react-i18next";

export default function PodOverviewPage() {
  const {i18n} = useTranslation();
  const language = (i18n.resolvedLanguage || "en_US").replace("_", "-");
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
      <div className="w-[min(1500px,95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          <div className="bg-sidebar aspect-video rounded-xl p-8">
            <span className="flex items-center gap-3 text-xl mb-5"><Bolt size={20}/> GENERAL</span>
            <div className="flex justify-between mb-1">
              <span className="text-primary/60">Namespace</span>
              <span>{pod?.namespace}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-primary/60">Node</span>
              <span>{pod?.node}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-primary/60">Start time</span>
              <span>{new Date(Date.now() - (pod ? pod.age : 0)).toLocaleString(language)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-primary/60">Labels</span>
              <div className="flex flex-col">
                <div className="flex items-center bg-muted py-0.5 pr-0.5 rounded-lg">
                  <span className="px-2">app</span>
                  <span className="bg-background px-2 rounded-r-sm">poddeck-agent</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-primary/60">Annotations</span>
              <span>kubectl.kubernetes.io/restartedAt</span>
            </div>
          </div>
          <div className="bg-sidebar aspect-video rounded-xl p-8">
            <span className="flex items-center gap-3 text-xl mb-5"><Lightbulb size={20}/> STATUS</span>
          </div>
          <div className="bg-sidebar aspect-video rounded-xl p-8">
            <span className="flex items-center gap-3 text-xl mb-5"><Network size={20}/> NETWORK</span>
          </div>
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-2">
          <div className="bg-sidebar aspect-video rounded-xl p-8">
            <span className="flex items-center gap-3 text-xl mb-5"><Container size={20}/> CONTAINERS</span>
          </div>
          <div className="bg-sidebar aspect-video rounded-xl p-8">
            <span className="flex items-center gap-3 text-xl mb-5"><CalendarClock size={20}/> EVENTS</span>
          </div>
        </div>
      </div>
    </PanelPage>
  )
}
