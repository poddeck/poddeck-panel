import {useEffect, useState} from "react";
import {DataTable} from "@/components/table";
import PanelPage from "@/layouts/panel";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import {PlusIcon, ServerIcon, Trash2} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip.tsx";
import nodeService, {type Node} from "@/api/services/node-service"
import {columns} from "./table-columns";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

function NodeAddButton() {
  const {t} = useTranslation();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size='lg'
          className='bg-primary'
        >
          <PlusIcon/>
          {t("panel.page.nodes.add")}
        </Button>
      </TooltipTrigger>
      <TooltipContent className='max-w-64 text-pretty'>
        <div className='flex items-center gap-1.5'>
          <p>{t("coming.soon")}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function NodeListEmpty() {
  const {t} = useTranslation();
  return (
    <PanelPage title="panel.page.nodes.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ServerIcon/>
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.nodes.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.nodes.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <NodeAddButton/>
        </EmptyContent>
      </Empty>
    </PanelPage>
  )
}

export default function NodesPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadNodes() {
      try {
        const response = await nodeService.list();
        if (response.success != false) {
          setNodes(response.nodes);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadNodes();
    const interval = window.setInterval(loadNodes, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  if (!isLoading && nodes.length === 0) {
    return <NodeListEmpty/>
  }
  return (
    <PanelPage title="panel.page.nodes.title">
      <div className="mt-[4vh]">
        <div className="flex items-center justify-end mb-[4vh]">
          <NodeAddButton/>
        </div>
        <DataTable<Node>
          name="nodes"
          columns={columns}
          data={nodes}
          pageSize={5}
          initialSorting={[{id: "name", desc: false}]}
          isLoading={isLoading}
          bulkActions={[
            {
              name: "panel.page.nodes.action.delete",
              icon: Trash2,
              onClick: () => {}
            }
          ]}
        />
      </div>
    </PanelPage>
  )
}
