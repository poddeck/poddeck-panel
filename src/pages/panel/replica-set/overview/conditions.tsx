import {useTranslation} from "react-i18next";
import type {ReplicaSet} from "@/api/services/replica-set-service.ts";
import {Lightbulb} from "lucide-react";

function ReplicaSetOverviewConditionStatus({isReady}: { isReady: boolean }) {
  if (!isReady) {
    return (
      <span className="relative flex size-2">
        <span
          className="relative inline-flex size-2 rounded-full bg-rose-500"></span>
      </span>
    )
  }
  return (
    <span className="relative flex size-2">
      <span
        className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
    </span>
  )
}

export default function ReplicaSetOverviewConditions({replicaSet}: { replicaSet: ReplicaSet | null }) {
  const {t} = useTranslation();
  return (
    <div className="bg-sidebar aspect-video rounded-xl p-8 pb-9 flex flex-col">
      <span className="flex items-center justify-between text-xl mb-5">
        <div className="flex items-center gap-3">
          <Lightbulb size={20}/> {t("panel.page.replica-set.overview.conditions.title")}
        </div>
        <div>
          <span>{replicaSet?.conditions.length}</span>
        </div>
      </span>
      <div
        className="overflow-y-auto flex-1 relative pb-8"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)"
        }}
      >
        {replicaSet &&
          replicaSet.conditions.map((condition) => (
            <div
              key={condition.type}
              className="w-full mx-auto mb-3 bg-muted border-1 px-3 py-2 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-2 ml-0.5">
                <ReplicaSetOverviewConditionStatus isReady={condition.status === "True"}/>
                <span>{condition.type} ({condition.reason})</span>
              </div>
              <div className="text-sm wrap-anywhere opacity-60">
                {condition.message}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}