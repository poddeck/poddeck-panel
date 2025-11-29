import PanelPage from "@/layouts/panel";
import PodPageBreadcrumb from "@/pages/panel/pod/breadcrumb.tsx";
import PodPageHeader from "@/pages/panel/pod/header.tsx";
import { useEffect, useState } from "react";
import podService, { type Pod, type PodLogResponse } from "@/api/services/pod-service.ts";
import { useSearchParams } from "react-router-dom";
import {AnsiUp} from 'ansi_up';

export default function PodLogsPage() {
  const [pod, setPod] = useState<Pod | null>(null);
  const [logs, setLogs] = useState<string>("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function loadPod() {
      const response = await podService.list();
      if (response.success !== false) {
        const podFromQuery = searchParams.get("pod");
        const pod = response.pods.find((entry) => entry.name === podFromQuery);
        if (pod) setPod(pod);
      }
    }

    loadPod();
    const interval = window.setInterval(loadPod, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadLogs() {
      if (!pod) return;
      const logResponse: PodLogResponse = await podService.log({
        namespace: pod.namespace,
        pod: pod.name,
        since_seconds: 300,
      });
      if (logResponse.success) {
        setLogs(logResponse.logs);
      }
    }

    loadLogs();
    const interval = window.setInterval(loadLogs, 2000);
    return () => clearInterval(interval);
  }, [pod]);

  const ansi = new AnsiUp();
  ansi.use_classes = true;

  const ansi_to_html = (txt: string) => ansi.ansi_to_html(txt);

  return (
    <PanelPage breadcrumb={PodPageBreadcrumb()} layout={false}>
      <PodPageHeader pod={pod} page="logs" />
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="bg-sidebar aspect-video rounded-xl p-4">
          <div
            className="bg-black p-4 rounded-xl overflow-auto h-full whitespace-pre-wrap font-mono"
            dangerouslySetInnerHTML={{ __html: ansi_to_html(logs) }}
          />
        </div>
      </div>
    </PanelPage>
  );
}
