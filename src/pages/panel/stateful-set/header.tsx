import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Link, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
  Activity,
  ChevronDown,
  Clock, Database,
  Group, RefreshCcw, Scale,
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
import StatefulSetService, {type StatefulSet} from "@/api/services/stateful-set-service.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import StatefulSetDeleteDialog from "@/pages/panel/stateful-sets/delete-dialog.tsx";
import {useRouter} from "@/routes/hooks";
import {toast} from "sonner";
import {Age} from "@/components/age/age.tsx";
import {Drawer, DrawerTrigger} from "@/components/ui/drawer.tsx";
import {StatefulSetScaleDrawer} from "@/pages/panel/stateful-set/scale.tsx";

const tabs = [
  {
    id: "overview",
    name: "panel.page.stateful-set.tabs.overview",
    url: "/stateful-set/overview/"
  },
  {
    id: "pods",
    name: "panel.page.stateful-set.tabs.pods",
    url: "/stateful-set/pods/"
  },
  {
    id: "edit",
    name: "panel.page.stateful-set.tabs.edit",
    url: "/stateful-set/edit/"
  },
]

export default function StatefulSetPageHeader(
  {
    statefulSet,
    page
  }: {
    statefulSet: StatefulSet | null,
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
            <Database size={60} className="ml-2"/>
            <Separator orientation="vertical" className="mx-5 h-15!"/>
            <div>
              <div className="flex items-center gap-3 mb-2">
                {statefulSet ? (
                  <span className="text-xl">{statefulSet.name}</span>
                ) : (
                  <Skeleton className="w-80 h-8"/>
                )}
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Activity size={16}/>
                  {statefulSet ? (
                    <span>{statefulSet.ready_replicas} / {statefulSet.replicas}</span>
                  ) : (
                    <Skeleton className="w-15 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Group size={16}/>
                  {statefulSet ? (
                    <span>{statefulSet.namespace}</span>
                  ) : (
                    <Skeleton className="w-30 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16}/>
                  {statefulSet ? (
                    <Age age={statefulSet!.age}/>
                  ) : (
                    <Skeleton className="w-8 h-6"/>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center mr-2">
            <Drawer open={scaleOpen} onOpenChange={setScaleOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="mr-5">
                  <Scale />
                </Button>
              </DrawerTrigger>
              <StatefulSetScaleDrawer statefulSet={statefulSet} open={scaleOpen} setOpen={setScaleOpen}/>
            </Drawer>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>
                    {t("panel.page.stateful-set.actions")}
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
                      StatefulSetService.restart({
                        namespace: statefulSet ? statefulSet.namespace : "",
                        stateful_set: statefulSet ? statefulSet.name : ""
                      });
                      toast.success(t("panel.page.stateful-sets.action.restart.successful"), {
                        position: "top-right",
                      });
                    }}
                    className="text-amber-600 flex items-center gap-2"
                  >
                    <RefreshCcw className="text-amber-600" size={16}/>
                    {t("panel.page.stateful-sets.action.restart")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-rose-600 flex items-center gap-2">
                        <Trash2 className="text-rose-600" size={16}/>
                        {t("panel.page.stateful-sets.action.delete")}
                      </div>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <StatefulSetDeleteDialog
                namespace={statefulSet ? statefulSet.namespace : ""}
                statefulSet={statefulSet ? statefulSet.name : ""}
                setOpen={setDeleteOpen}
                onDelete={() => replace("/stateful-sets/")}
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