import {
  CalendarClock,
  Siren,
  TriangleAlert
} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {Pod} from "@/api/services/pod-service.ts";
import {cn} from "@/lib/utils.ts";
import {PodAge} from "@/pages/panel/pod/age.tsx";

export default function PodOverviewEvents({pod}: { pod: Pod | null }) {
  const {t} = useTranslation();
  const events = pod?.events ?? [];
  const statusColor = events.some(e => e.type.toLowerCase() === "error")
    ? "text-rose-500"
    : events.some(e => e.type.toLowerCase() === "warning")
      ? "text-amber-500"
      : "text-primary";
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center justify-between text-xl mb-5">
        <div className="flex items-center gap-3">
          <CalendarClock size={20}/> {t("panel.page.pod.overview.events.title")}
        </div>
        <div>
          <span className={statusColor}>{events.length}</span>
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
          [...pod.events]
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((event) => {
              let color = "text-primary";
              let icon = null;
              if (event.type.toLowerCase() === "warning") {
                color = "text-amber-500";
                icon = <TriangleAlert/>;
              } else if (event.type.toLowerCase() === "error") {
                color = "text-rose-500";
                icon = <Siren/>;
              }
              return (
                <div
                  key={event.reason}
                  className={cn(color, "w-[min(calc(500px),100%)] mx-auto mb-3 bg-muted border-1 px-3 py-2 rounded-lg")}
                >
                  <div className="flex items-center justify-between mb-2 ml-0.5">
                    <div className="flex items-center gap-3">
                      {icon}
                      <span>{event.reason} ({event.type})</span>
                    </div>
                    <div>
                      <PodAge age={Date.now() - event.timestamp}/>
                    </div>
                  </div>
                  <span className="text-sm opacity-75">{event.message}</span>
                </div>
              )
            })
        }
      </div>
    </div>
  );
}
