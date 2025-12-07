import {useEffect, useState} from "react";
import {DataTable} from "@/components/table";
import PanelPage from "@/layouts/panel";
import {useTranslation} from "react-i18next";
import {Box, PlusIcon, Trash2} from "lucide-react";
import deploymentService, {type Deployment} from "@/api/services/deployment-service"
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
import DeploymentService from "@/api/services/deployment-service";
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import DeploymentAddDialog from "@/pages/panel/deployments/add-dialog.tsx";

function DeploymentAddButton() {
  const {t} = useTranslation();
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          size='lg'
          className='bg-primary'
        >
          <PlusIcon/>
          {t("panel.page.deployments.add")}
        </Button>
      </DialogTrigger>
      <DeploymentAddDialog/>
    </Dialog>
  )
}

function DeploymentListEmpty() {
  const {t} = useTranslation();
  return (
    <PanelPage title="panel.page.deployments.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Box/>
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.deployments.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.deployments.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <DeploymentAddButton/>
        </EmptyContent>
      </Empty>
    </PanelPage>
  )
}

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {replace} = useRouter();
  useEffect(() => {
    async function loadDeployments() {
      try {
        const response = await deploymentService.list();
        if (response.success != false) {
          setDeployments(response.deployments);
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

    loadDeployments();
    loadNamespaces();
    const interval = window.setInterval(loadDeployments, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  if (!isLoading && deployments.length === 0) {
    return <DeploymentListEmpty/>
  }
  return (
    <PanelPage title="panel.page.deployments.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <DeploymentAddButton/>
        </div>
        <DataTable<Deployment>
          name="deployments"
          columns={columns}
          data={deployments}
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
          onClick={deployment => replace("/deployment/overview/?" +
            "deployment=" + deployment.name + "&namespace=" + deployment.namespace)}
          bulkActions={[
            {
              name: "panel.page.deployments.action.delete",
              icon: Trash2,
              onClick: (entries) => {
                entries.forEach(entry => {
                  DeploymentService.remove({
                    namespace: entry.namespace,
                    deployment: entry.name
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
