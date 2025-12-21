import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Link, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
  Activity,
  ChevronDown,
  Clock,
  Group, RefreshCcw,
  Rocket, Scale,
  Trash2
} from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useState} from "react";
import NodeService, {type Node} from "@/api/services/node-service.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import {useRouter} from "@/routes/hooks";
import {Drawer, DrawerTrigger} from "@/components/ui/drawer.tsx";
import {toast} from "sonner";
import {Age} from "@/components/age/age.tsx";

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
  const {replace} = useRouter();
  const [actionsOpen, setActionsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [scaleOpen, setScaleOpen] = useState(false);
  const [searchParams] = useSearchParams();
  return (
    <div className="w-full bg-sidebar mb-6">
      <div className="w-[min(1500px,95%)] mx-auto flex flex-col flex-1">
        <div className="flex items-center justify-between pt-10 pb-8">
          <div className="flex items-center">
            <Rocket size={60} className="ml-2"/>
            <Separator orientation="vertical" className="mx-5 h-15!"/>
            <div>
              <div className="flex items-center gap-3 mb-2">
                {node ? (
                  <span className="text-xl">{node.name}</span>
                ) : (
                  <Skeleton className="w-80 h-8"/>
                )}
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Activity size={16}/>
                  {node ? (
                    <span>{node.ready_replicas} / {node.replicas}</span>
                  ) : (
                    <Skeleton className="w-15 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Group size={16}/>
                  {node ? (
                    <span>{node.namespace}</span>
                  ) : (
                    <Skeleton className="w-30 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16}/>
                  {node ? (
                    <Age age={node!.age}/>
                  ) : (
                    <Skeleton className="w-8 h-6"/>
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
                  <DropdownMenuItem
                    onClick={() => {
                      NodeService.restart({
                        namespace: node ? node.namespace : "",
                        node: node ? node.name : ""
                      });
                      toast.success(t("panel.page.nodes.action.restart.successful"), {
                        position: "top-right",
                      });
                    }}
                    className="text-amber-600 flex items-center gap-2"
                  >
                    <RefreshCcw className="text-amber-600" size={16}/>
                    {t("panel.page.nodes.action.restart")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-rose-600 flex items-center gap-2">
                        <Trash2 className="text-rose-600" size={16}/>
                        {t("panel.page.nodes.action.delete")}
                      </div>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <NodeDeleteDialog
                namespace={node ? node.namespace : ""}
                node={node ? node.name : ""}
                setOpen={setDeleteOpen}
                onDelete={() => replace("/nodes/")}
              />
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