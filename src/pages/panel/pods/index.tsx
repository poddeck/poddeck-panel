import {useEffect, useState} from "react";
import {DataTable} from "@/components/table";
import PanelPage from "@/layouts/panel";
import {useTranslation} from "react-i18next";
import {Box} from "lucide-react";
import podService, {type Pod} from "@/api/services/pod-service"
import {columns} from "./table-columns";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {useRouter} from "@/routes/hooks";

function PodListEmpty() {
  const {t} = useTranslation();
  return (
    <PanelPage title="panel.page.pods.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Box/>
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.pods.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.pods.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PanelPage>
  )
}

export default function PodsPage() {
  const [pods, setPods] = useState<Pod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {replace} = useRouter();
  useEffect(() => {
    async function loadPods() {
      try {
        const response = await podService.list();
        if (response.success != false) {
          setPods(response.pods);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadPods();
    const interval = window.setInterval(loadPods, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  if (!isLoading && pods.length === 0) {
    return <PodListEmpty/>
  }
  return (
    <PanelPage title="panel.page.pods.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
        </div>
        <DataTable<Pod>
          name="pods"
          columns={columns}
          data={pods}
          pageSize={5}
          initialSorting={[{id: "namespace", desc: false}]}
          isLoading={isLoading}
          visibilityState={{node: false, ip: false}}
          onClick={row => replace("/pod/overview/?pod=" + row.original.name +
            "&namespace=" + row.original.namespace)}
        />
      </div>
    </PanelPage>
  )
}
