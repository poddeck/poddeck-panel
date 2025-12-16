import {useEffect, useState} from "react";
import {DataTable} from "@/components/table";
import PanelPage from "@/layouts/panel";
import {useTranslation} from "react-i18next";
import {Box, PlusIcon, Trash2} from "lucide-react";
import serviceService from "@/api/services/service-service"
import ServiceService, {type Service} from "@/api/services/service-service"
import {columns} from "./table-columns";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import namespaceService, {
  type Namespace
} from "@/api/services/namespace-service.ts";
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import ServiceAddDialog from "@/pages/panel/services/add-dialog.tsx";

function ServiceAddButton() {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          size='lg'
          className='bg-primary'
        >
          <PlusIcon/>
          {t("panel.page.services.add")}
        </Button>
      </DialogTrigger>
      <ServiceAddDialog setOpen={setOpen}/>
    </Dialog>
  )
}

function ServiceListEmpty() {
  const {t} = useTranslation();
  return (
    <PanelPage title="panel.page.services.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Box/>
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.services.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.services.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ServiceAddButton/>
        </EmptyContent>
      </Empty>
    </PanelPage>
  )
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadServices() {
      try {
        const response = await serviceService.list();
        if (response.success != false) {
          setServices(response.services);
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

    loadServices();
    loadNamespaces();
    const interval = window.setInterval(loadServices, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  if (!isLoading && services.length === 0) {
    return <ServiceListEmpty/>
  }
  return (
    <PanelPage title="panel.page.services.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <ServiceAddButton/>
        </div>
        <DataTable<Service>
          name="services"
          columns={columns}
          data={services}
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
          bulkActions={[
            {
              name: "panel.page.services.action.delete",
              icon: Trash2,
              onClick: (entries) => {
                entries.forEach(entry => {
                  ServiceService.remove({
                    namespace: entry.namespace,
                    service: entry.name
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
