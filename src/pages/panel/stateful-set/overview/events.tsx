import {CalendarClock, Siren, TriangleAlert} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {StatefulSet} from "@/api/services/stateful-set-service.ts";
import {cn} from "@/lib/utils.ts";
import {Age} from "@/components/age/age.tsx";

export default function StatefulSetOverviewEvents({statefulSet}: { statefulSet: StatefulSet | null }) {
  const {t} = useTranslation();
  const events = statefulSet?.events ?? [];
  const statusColor = events.some(e => e.type.toLowerCase() === "error")
    ? "text-rose-500"
    : events.some(e => e.type.toLowerCase() === "warning")
      ? "text-amber-500"
      : "text-primary";

  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center justify-between text-xl mb-5">
        <div className="flex items-center gap-3">
          <CalendarClock size={20}/> {t("panel.page.stateful-set.overview.events.title")}
        </div>
        <div>
          <span className={statusColor}>{events.length}</span>
        </div>
      </span>

      <div
        className="overflow-y-auto flex-1 relative pb-8 pr-2 w-full mx-auto"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)"
        }}
      >
        <div
          className="relative before:absolute before:left-2 before:top-1 before:h-full before:w-0.5 before:bg-primary/20">
          {statefulSet &&
            [...statefulSet.events]
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((event) => {
                let color = "text-primary";
                let icon = null;
                if (event.type.toLowerCase() === "warning") {
                  color = "text-amber-500";
                  icon = <TriangleAlert size={16}/>;
                } else if (event.type.toLowerCase() === "error") {
                  color = "text-rose-500";
                  icon = <Siren size={16}/>;
                }

                return (
                  <div key={event.reason}
                       className="relative mb-8 flex items-start">
                    <div className="absolute left-[1px] top-1">
                      <div
                        className="rounded-full w-4 h-4 flex items-center justify-center border-2 border-primary/75 bg-sidebar">
                      </div>
                    </div>
                    <div className={cn("ml-8 w-full", color)}>
                      <div
                        className="flex items-center justify-between mb-2 ml-0.5">
                        <div className="flex items-center gap-3">
                          {icon}
                          <span>{event.reason} ({event.type})</span>
                        </div>
                        <div>
                          <Age age={Date.now() - event.timestamp}/>
                        </div>
                      </div>
                      <div
                        className={cn("text-sm wrap-anywhere opacity-60", color)}>
                        {event.message}
                      </div>
                    </div>
                  </div>
                );
              })
          }
        </div>
      </div>
    </div>
  );
}
