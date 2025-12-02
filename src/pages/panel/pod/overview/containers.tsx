import {
  Container,
  FileImage,
  Lightbulb,
  RotateCcw
} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {Pod} from "@/api/services/pod-service.ts";

function PodOverviewContainerStatus({isReady}: { isReady: boolean }) {
  if (!isReady) {
    return (
      <span className="relative flex size-2">
        <span
          className="relative inline-flex size-2 rounded-full bg-zinc-500"></span>
      </span>
    )
  }
  return (
    <span className="relative flex size-2">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
      <span
        className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
    </span>
  )
}

export default function PodOverviewContainers({pod}: { pod: Pod | null }) {
  const {t} = useTranslation();
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center justify-between text-xl mb-5">
        <div className="flex items-center gap-3">
          <Container size={20}/> {t("panel.page.pod.overview.containers.title")}
        </div>
        <div>
          <span>{pod?.ready_containers} / {pod?.total_containers}</span>
        </div>
      </span>
      <div
        className="overflow-y-auto flex-1 relative pb-8"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)"
        }}
      >
        {pod &&
          pod.containers.map((container) => (
            <div
              key={container.name}
              className="w-full mx-auto mb-3 bg-muted border-1 px-3 py-2 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-2 ml-0.5">
                <PodOverviewContainerStatus isReady={container.ready}/>
                <span>{container.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <FileImage size={14}/>
                  <span>{container.image}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lightbulb size={14}/>
                  <span>{container.state}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RotateCcw size={14}/>
                  <span>{container.restarts}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}