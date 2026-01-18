import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Link, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
  Activity,
  ChevronDown,
  Clock,
  Group, RefreshCcw,
  Trash2, VectorSquare
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
import DaemonSetService, {type DaemonSet} from "@/api/services/daemon-set-service.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import DaemonSetDeleteDialog from "@/pages/panel/daemon-sets/delete-dialog.tsx";
import {useRouter} from "@/routes/hooks";
import {toast} from "sonner";
import {Age} from "@/components/age/age.tsx";

const tabs = [
  {
    id: "overview",
    name: "panel.page.daemon-set.tabs.overview",
    url: "/daemon-set/overview/"
  },
  {
    id: "pods",
    name: "panel.page.daemon-set.tabs.pods",
    url: "/daemon-set/pods/"
  },
  {
    id: "edit",
    name: "panel.page.daemon-set.tabs.edit",
    url: "/daemon-set/edit/"
  },
]

export default function DaemonSetPageHeader(
  {
    daemonSet,
    page
  }: {
    daemonSet: DaemonSet | null,
    page: string
  }
) {
  const {t} = useTranslation();
  const {replace} = useRouter();
  const [actionsOpen, setActionsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchParams] = useSearchParams();
  return (
    <div className="w-full bg-sidebar mb-6">
      <div className="w-[min(1500px,95%)] mx-auto flex flex-col flex-1">
        <div className="flex items-center justify-between pt-10 pb-8">
          <div className="flex items-center">
            <VectorSquare size={60} className="ml-2"/>
            <Separator orientation="vertical" className="mx-5 h-15!"/>
            <div>
              <div className="flex items-center gap-3 mb-2">
                {daemonSet ? (
                  <span className="text-xl">{daemonSet.name}</span>
                ) : (
                  <Skeleton className="w-80 h-8"/>
                )}
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Activity size={16}/>
                  {daemonSet ? (
                    <span>{daemonSet.current_number_scheduled} / {daemonSet.desired_number_scheduled}</span>
                  ) : (
                    <Skeleton className="w-15 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Group size={16}/>
                  {daemonSet ? (
                    <span>{daemonSet.namespace}</span>
                  ) : (
                    <Skeleton className="w-30 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16}/>
                  {daemonSet ? (
                    <Age age={daemonSet!.age}/>
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
                    {t("panel.page.daemon-set.actions")}
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
                      DaemonSetService.restart({
                        namespace: daemonSet ? daemonSet.namespace : "",
                        daemon_set: daemonSet ? daemonSet.name : ""
                      });
                      toast.success(t("panel.page.daemon-sets.action.restart.successful"), {
                        position: "top-right",
                      });
                    }}
                    className="text-amber-600 flex items-center gap-2"
                  >
                    <RefreshCcw className="text-amber-600" size={16}/>
                    {t("panel.page.daemon-sets.action.restart")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-rose-600 flex items-center gap-2">
                        <Trash2 className="text-rose-600" size={16}/>
                        {t("panel.page.daemon-sets.action.delete")}
                      </div>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DaemonSetDeleteDialog
                namespace={daemonSet ? daemonSet.namespace : ""}
                daemonSet={daemonSet ? daemonSet.name : ""}
                setOpen={setDeleteOpen}
                onDelete={() => replace("/daemon-sets/")}
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