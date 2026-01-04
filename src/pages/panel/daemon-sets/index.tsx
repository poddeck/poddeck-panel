import {useEffect, useState} from "react";
import {DataTable} from "@/components/table";
import PanelPage from "@/layouts/panel";
import {useTranslation} from "react-i18next";
import {Box, PlusIcon, RefreshCcw, Trash2} from "lucide-react";
import daemonSetService, {type DaemonSet} from "@/api/services/daemon-set-service"
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
import DaemonSetService from "@/api/services/daemon-set-service";
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import DaemonSetAddDialog from "@/pages/panel/daemon-sets/add-dialog.tsx";

function DaemonSetAddButton() {
  const {t} = useTranslation();
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          size='lg'
          className='bg-primary'
        >
          <PlusIcon/>
          {t("panel.page.daemon-sets.add")}
        </Button>
      </DialogTrigger>
      <DaemonSetAddDialog/>
    </Dialog>
  )
}

function DaemonSetListEmpty() {
  const {t} = useTranslation();
  return (
    <PanelPage title="panel.page.daemon-sets.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Box/>
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.daemon-sets.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.daemon-sets.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <DaemonSetAddButton/>
        </EmptyContent>
      </Empty>
    </PanelPage>
  )
}

export default function DaemonSetsPage() {
  const [daemonSets, setDaemonSets] = useState<DaemonSet[]>([]);
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {replace} = useRouter();
  useEffect(() => {
    async function loadDaemonSets() {
      try {
        const response = await daemonSetService.list();
        if (response.success != false) {
          setDaemonSets(response.daemon_sets);
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

    loadDaemonSets();
    loadNamespaces();
    const interval = window.setInterval(loadDaemonSets, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  if (!isLoading && daemonSets.length === 0) {
    return <DaemonSetListEmpty/>
  }
  return (
    <PanelPage title="panel.page.daemon-sets.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <DaemonSetAddButton/>
        </div>
        <DataTable<DaemonSet>
          name="daemon-sets"
          columns={columns}
          data={daemonSets}
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
          onClick={daemonSet => replace("/daemon-set/overview/?" +
            "daemon-set=" + daemonSet.name + "&namespace=" + daemonSet.namespace)}
          bulkActions={[
            {
              name: "panel.page.daemon-sets.action.restart",
              icon: RefreshCcw,
              onClick: (entries) => {
                entries.forEach(entry => {
                  DaemonSetService.restart({
                    namespace: entry.namespace,
                    daemon_set: entry.name
                  });
                })
              }
            },
            {
              name: "panel.page.daemon-sets.action.delete",
              icon: Trash2,
              onClick: (entries) => {
                entries.forEach(entry => {
                  DaemonSetService.remove({
                    namespace: entry.namespace,
                    daemon_set: entry.name
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
