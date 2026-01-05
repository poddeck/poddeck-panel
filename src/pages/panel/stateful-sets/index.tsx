import {useEffect, useState} from "react";
import {DataTable} from "@/components/table";
import PanelPage from "@/layouts/panel";
import {useTranslation} from "react-i18next";
import {Box, PlusIcon, RefreshCcw, Trash2} from "lucide-react";
import statefulSetService, {type StatefulSet} from "@/api/services/stateful-set-service"
import {columns} from "./table-columns";
import {
  Empty, EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {useRouter} from "@/routes/hooks";
import namespaceService, {type Namespace} from "@/api/services/namespace-service.ts";
import StatefulSetService from "@/api/services/stateful-set-service";
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import StatefulSetAddDialog from "@/pages/panel/stateful-sets/add-dialog.tsx";

function StatefulSetAddButton() {
  const {t} = useTranslation();
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          size='lg'
          className='bg-primary'
        >
          <PlusIcon/>
          {t("panel.page.stateful-sets.add")}
        </Button>
      </DialogTrigger>
      <StatefulSetAddDialog/>
    </Dialog>
  )
}

function StatefulSetListEmpty() {
  const {t} = useTranslation();
  return (
    <PanelPage title="panel.page.stateful-sets.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Box/>
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.stateful-sets.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.stateful-sets.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <StatefulSetAddButton/>
        </EmptyContent>
      </Empty>
    </PanelPage>
  )
}

export default function StatefulSetsPage() {
  const [statefulSets, setStatefulSets] = useState<StatefulSet[]>([]);
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {replace} = useRouter();
  useEffect(() => {
    async function loadStatefulSets() {
      try {
        const response = await statefulSetService.list();
        if (response.success != false) {
          setStatefulSets(response.stateful_sets);
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

    loadStatefulSets();
    loadNamespaces();
    const interval = window.setInterval(loadStatefulSets, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  if (!isLoading && statefulSets.length === 0) {
    return <StatefulSetListEmpty/>
  }
  return (
    <PanelPage title="panel.page.stateful-sets.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <StatefulSetAddButton/>
        </div>
        <DataTable<StatefulSet>
          name="stateful-sets"
          columns={columns}
          data={statefulSets}
          pageSize={5}
          initialSorting={[{id: "namespace", desc: false}]}
          isLoading={isLoading}
          visibilityState={{node: false, ip: false}}
          filters={[
            {
              column: 'namespace',
              options: namespaces.map(namespace => namespace.name)
            },
          ]}
          onClick={statefulSet => replace("/stateful-set/overview/?" +
            "stateful-set=" + statefulSet.name + "&namespace=" + statefulSet.namespace)}
          bulkActions={[
            {
              name: "panel.page.stateful-sets.action.restart",
              icon: RefreshCcw,
              onClick: (entries) => {
                entries.forEach(entry => {
                  StatefulSetService.restart({
                    namespace: entry.namespace,
                    stateful_set: entry.name
                  });
                })
              }
            },
            {
              name: "panel.page.stateful-sets.action.delete",
              icon: Trash2,
              onClick: (entries) => {
                entries.forEach(entry => {
                  StatefulSetService.remove({
                    namespace: entry.namespace,
                    stateful_set: entry.name
                  });
                })
              }
            }
          ]}
        />
      </div>
    </PanelPage>
  )
}
