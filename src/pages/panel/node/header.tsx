import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Link, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
  ChevronDown,
  Cpu,
  HardDrive,
  Layers,
  MemoryStick,
  Server
} from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useState} from "react";
import {type Node} from "@/api/services/node-service.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Dialog} from "@/components/ui/dialog.tsx";
import NodeHeaderStatus from "@/pages/panel/node/status.tsx";

const tabs = [
  {
    id: "overview",
    name: "panel.page.node.tabs.overview",
    url: "/node/overview/"
  },
  {
    id: "workload",
    name: "panel.page.node.tabs.workload",
    url: "/node/workload/"
  },
  {
    id: "pods",
    name: "panel.page.node.tabs.pods",
    url: "/node/pods/"
  },
]

export default function NodePageHeader(
  {
    node,
    page
  }: {
    node: Node | null,
    page: string
  }
) {
  const {t} = useTranslation();
  const [actionsOpen, setActionsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchParams] = useSearchParams();
  return (
    <div className="w-full bg-sidebar mb-6">
      <div className="w-[min(1500px,95%)] mx-auto flex flex-col flex-1">
        <div className="flex items-center justify-between pt-10 pb-8">
          <div className="flex items-center">
            <Server size={60} className="ml-2"/>
            <Separator orientation="vertical" className="mx-5 h-15!"/>
            <div>
              <div className="flex items-center gap-3 mb-2">
                {node ? (
                  <>
                    <NodeHeaderStatus isActive={node.ready}/>
                    <span className="text-xl">{node.name}</span>
                  </>
                ) : (
                  <Skeleton className="w-80 h-8"/>
                )}
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Cpu size={16}/>
                  {node ? (
                    <span>{node.cpu_cores} {t("panel.page.nodes.cores")}</span>
                  ) : (
                    <Skeleton className="w-15 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MemoryStick size={16}/>
                  {node ? (
                    <span>{node.total_memory.toFixed(2)} GB</span>
                  ) : (
                    <Skeleton className="w-15 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive size={16}/>
                  {node ? (
                    <span>{node.total_storage.toFixed(2)} GB</span>
                  ) : (
                    <Skeleton className="w-15 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Layers size={16}/>
                  {node ? (
                    <span>{node.kubelet_version}</span>
                  ) : (
                    <Skeleton className="w-30 h-6"/>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center mr-2">
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>
                    {t("panel.page.node.actions")}
                    <ChevronDown
                      className={`ml-2 transition-transform duration-300 ${
                        actionsOpen ? 'scale-y-[-1]' : 'scale-y-100'
                      }`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuSeparator/>
                <DropdownMenuContent align="end">
                </DropdownMenuContent>
              </DropdownMenu>
            </Dialog>
          </div>
        </div>
        <div className='w-full max-w-md'>
          <Tabs defaultValue={page}>
            <TabsList className='bg-transparent rounded-none gap-2'>
              {tabs.map(tab => (
                <Link to={tab.url + "?" + searchParams.toString()}>
                  <TabsTrigger
                    value={tab.id}
                    className='bg-transparent! hover:text-primary! data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 mt-1.5 border-transparent data-[state=active]:shadow-none'
                  >
                    {t(tab.name)}
                  </TabsTrigger>
                </Link>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  )
}