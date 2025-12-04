import {Box, Trash2} from "lucide-react";
import {DataTable} from "@/components/table";
import {useEffect, useState} from "react";
import namespaceService, {
  type Namespace
} from "@/api/services/namespace-service.ts";
import {useRouter} from "@/routes/hooks";
import PanelPage from "@/layouts/panel";
import {useTranslation} from "react-i18next";
import podService, {type Pod} from "@/api/services/pod-service"
import {columns} from "./table-columns";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

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

export default function PodsList() {
  const [pods, setPods] = useState<Pod[]>([]);
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
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

    async function loadNamespaces() {
      const response = await namespaceService.list();
      if (response.success !== false) {
        setNamespaces(response.namespaces);
      }
    }

    loadPods();
    loadNamespaces();
    const interval = window.setInterval(loadPods, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  if (!isLoading && pods.length === 0) {
    return <PodListEmpty/>
  }
  return (
    <DataTable<Pod>
      name="pods"
      columns={columns}
      data={pods}
      pageSize={5}
      initialSorting={[{id: "namespace", desc: false}]}
      isLoading={isLoading}
      visibilityState={{node: false, pod_ip: false, controlled_by: false}}
      filters={[
        {
          column: 'namespace',
          options: namespaces.map(namespace => namespace.name)
        },
      ]}
      onClick={pod => replace("/pod/overview/?pod=" + pod.name +
        "&namespace=" + pod.namespace)}
      bulkActions={[
        {
          name: "panel.page.pods.action.delete",
          icon: Trash2,
          onClick: (entries) => {
            entries.forEach(entry => {
              podService.remove({
                namespace: entry.namespace,
                pod: entry.name
              });
            })
          }
        }
      ]}
    />
  )
}