import {useEffect, useState} from "react";
import {DataTable} from "@/components/table";
import PanelPage from "@/layouts/panel";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import {PlusIcon} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip.tsx";
import nodeService, {type Node} from "@/api/services/node-service"
import {columns} from "./table-columns";

export default function NodesPage() {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadNodes() {
      try {
        const response = await nodeService.list();
        setNodes(response.nodes);
      } finally {
        setIsLoading(false);
      }
    }
    loadNodes();
  }, []);
  return (
    <PanelPage title="panel.page.nodes.title">
      <div className="flex items-center justify-end mb-[4vh]">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size='lg'
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
      </div>
      <DataTable<Node>
        columns={columns}
        data={nodes}
        pageSize={5}
        initialSorting={[{id: "name", desc: false}]}
        isLoading={isLoading}
      />
    </PanelPage>
  )
}
