import { useState } from "react";
import { DataTable } from "@/components/table";
import PanelPage from "@/layouts/panel";
import { useTranslation } from "react-i18next";
import { Box, PlusIcon, Trash2 } from "lucide-react";
import serviceService from "@/api/services/service-service";
import ServiceService, { type Service } from "@/api/services/service-service";
import { columns } from "./table-columns";
import {
  useAgentQuery,
  useInvalidateAgentQuery,
} from "@/hooks/use-agent-query";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import namespaceService from "@/api/services/namespace-service.ts";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import ServiceAddDialog from "@/pages/panel/services/add-dialog.tsx";

function ServiceAddButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="lg" className="bg-primary">
          <PlusIcon />
          {t("panel.page.services.add")}
        </Button>
      </DialogTrigger>
      <ServiceAddDialog setOpen={setOpen} />
    </Dialog>
  );
}

function ServiceListEmpty() {
  const { t } = useTranslation();
  return (
    <PanelPage title="panel.page.services.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Box />
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.services.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.services.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ServiceAddButton />
        </EmptyContent>
      </Empty>
    </PanelPage>
  );
}

export default function ServicesPage() {
  const servicesQuery = useAgentQuery(["services"], serviceService.list);
  const namespacesQuery = useAgentQuery(["namespaces"], namespaceService.list);
  const invalidate = useInvalidateAgentQuery();
  const services = servicesQuery.data?.services ?? [];
  const namespaces = namespacesQuery.data?.namespaces ?? [];
  if (
    !servicesQuery.isLoading &&
    !servicesQuery.isError &&
    services.length === 0
  ) {
    return <ServiceListEmpty />;
  }
  return (
    <PanelPage title="panel.page.services.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <ServiceAddButton />
        </div>
        <DataTable<Service>
          name="services"
          columns={columns}
          data={services}
          pageSize={5}
          initialSorting={[{ id: "namespace", desc: false }]}
          isLoading={servicesQuery.isLoading}
          isFetching={servicesQuery.isFetching}
          isError={servicesQuery.isError}
          onRetry={() => servicesQuery.refetch()}
          visibilityState={{ node: false, ip: false }}
          filters={[
            {
              column: "namespace",
              options: namespaces.map((namespace) => namespace.name),
            },
          ]}
          bulkActions={[
            {
              name: "panel.page.services.action.delete",
              icon: Trash2,
              onClick: (entries) => {
                Promise.allSettled(
                  entries.map((entry) =>
                    ServiceService.remove({
                      namespace: entry.namespace,
                      service: entry.name,
                    }),
                  ),
                ).then(() => invalidate(["services"]));
              },
            },
          ]}
        />
      </div>
    </PanelPage>
  );
}
