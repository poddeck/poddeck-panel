import {useEffect, useRef, useState} from "react";
import PanelPage from "@/layouts/panel";
import PodPageBreadcrumb from "@/pages/panel/pod/breadcrumb.tsx";
import PodPageHeader from "@/pages/panel/pod/header.tsx";
import podService, {
  type PodLogResponse
} from "@/api/services/pod-service.ts";
import {AnsiUp} from "ansi_up";
import usePod from "@/hooks/use-pod.ts";

type LogEntry = {
  original: string;
  display: string;
};

export default function PodLogsPage() {
  const pod = usePod();
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement | null>(null);
  const autoScrollRef = useRef(true);
  const logsRef = useRef<LogEntry[]>([]);
  const firstRunRef = useRef(true);

  useEffect(() => {
    if (!pod) {
      return;
    }
    let isMounted = true;

    const fetchPodLogs = async () => {
      const logResponse: PodLogResponse = await podService.log({
        namespace: pod.namespace,
        pod: pod.name,
        since_seconds: firstRunRef.current ? -1 : 2,
      });
      if (!logResponse.success || !isMounted) {
        return;
      }
      const lines = logResponse.logs
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l !== "")
        .filter((l) => !logsRef.current.some((existing) => existing.original === l));
      if (lines.length > 0) {
        updateLogs(lines);
      }
      if (firstRunRef.current) {
        firstRunRef.current = false;
      }
    };

    const updateLogs = (lines: string[]) => {
      const mapped = lines.map((l) => {
        const firstSpace = l.indexOf(" ");
        const display = firstSpace > 0 ? l.slice(firstSpace + 1) : l;
        return { original: l, display };
      });

      logsRef.current = [...logsRef.current, ...mapped];
      setLogs(logsRef.current.map((l) => l.display));
    };

    fetchPodLogs();
    const interval = setInterval(fetchPodLogs, 1000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [pod]);

  const handleScroll = () => {
    if (!logRef.current) {
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = logRef.current;
    autoScrollRef.current = scrollTop + clientHeight >= scrollHeight - 10;
  };
  useEffect(() => {
    if (autoScrollRef.current && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const ansi = new AnsiUp();
  ansi.use_classes = false;
  const htmlLogs = logs.map(l => ansi.ansi_to_html(l)).join("<br/>");

  return (
    <PanelPage breadcrumb={PodPageBreadcrumb()} layout={false}>
      <PodPageHeader pod={pod} page="logs" />
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="bg-sidebar aspect-video rounded-xl p-4">
          <div
            ref={logRef}
            onScroll={handleScroll}
            className="bg-white dark:bg-black p-4 rounded-xl overflow-auto h-full whitespace-pre-wrap font-mono select-text"
            dangerouslySetInnerHTML={{ __html: htmlLogs }}
          />
        </div>
      </div>
    </PanelPage>
  );
}
