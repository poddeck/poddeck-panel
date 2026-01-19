import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Link, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
  AlarmClock,
  ChevronDown, ClipboardClock,
  Clock,
  Group, Pause, Play,
  Trash2
} from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import React, {useState} from "react";
import cronJobService, {type CronJob} from "@/api/services/cron-job-service.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import CronJobDeleteDialog from "@/pages/panel/cron-jobs/delete-dialog.tsx";
import {useRouter} from "@/routes/hooks";
import {Age} from "@/components/age/age.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip.tsx";
import {toast} from "sonner";

const tabs = [
  {
    id: "overview",
    name: "panel.page.cron-job.tabs.overview",
    url: "/cron-job/overview/"
  },
  {
    id: "edit",
    name: "panel.page.cron-job.tabs.edit",
    url: "/cron-job/edit/"
  },
]

export default function CronJobPageHeader(
  {
    cronJob,
    page
  }: {
    cronJob: CronJob | null,
    page: string
  }
) {
  const {t} = useTranslation();
  const {replace} = useRouter();
  const [actionsOpen, setActionsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [checked, setChecked] = useState<boolean>(true);
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    if (cronJob) {
      setChecked(!cronJob.suspend);
    }
  }, [cronJob]);
  React.useEffect(() => {
    if (!cronJob) {
      return;
    }
    cronJobService.suspend({
      cron_job: cronJob.name,
      namespace: cronJob.namespace,
      suspend: !checked
    });
  }, [checked]);

  const runCronJob = async () => {
    if (!cronJob) {
      return;
    }
    const response = await cronJobService.run({
      cron_job: cronJob.name, namespace: cronJob.namespace
    });
    if (response.success) {
      toast.success(t("panel.page.cron-job.run.successful"), {
        position: "top-right",
      });
    } else {
      toast.error(t("panel.page.cron-job.run.failed"), {
        position: "top-right",
      });
    }
  }

  return (
    <div className="w-full bg-sidebar mb-6">
      <div className="w-[min(1500px,95%)] mx-auto flex flex-col flex-1">
        <div className="flex items-center justify-between pt-10 pb-8">
          <div className="flex items-center">
            <AlarmClock size={60} className="ml-2"/>
            <Separator orientation="vertical" className="mx-5 h-15!"/>
            <div>
              <div className="flex items-center gap-3 mb-2">
                {cronJob ? (
                  <span className="text-xl">{cronJob.name}</span>
                ) : (
                  <Skeleton className="w-80 h-8"/>
                )}
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <ClipboardClock size={16}/>
                  {cronJob ? (
                    <span>{cronJob.schedule}</span>
                  ) : (
                    <Skeleton className="w-30 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Group size={16}/>
                  {cronJob ? (
                    <span>{cronJob.namespace}</span>
                  ) : (
                    <Skeleton className="w-30 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16}/>
                  {cronJob ? (
                    <Age age={cronJob!.age}/>
                  ) : (
                    <Skeleton className="w-8 h-6"/>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={runCronJob}
                  className="mr-2"
                >
                  <Play/>
                </Button>
              </TooltipTrigger>
              <TooltipContent className='max-w-64 text-pretty'>
                <div className='flex items-center gap-1.5'>
                  <p>{t("panel.page.cron-job.run.label")}</p>
                </div>
              </TooltipContent>
            </Tooltip>
            <HoverCard openDelay={0} closeDelay={0}>
              <HoverCardTrigger asChild>
                <div className='inline-flex items-center gap-2 mr-4'>
                  <Switch
                    id='icon-label'
                    checked={checked}
                    onCheckedChange={setChecked}
                    aria-label='Toggle switch'
                    className='h-7 w-12 [&_span]:size-6 data-[state=checked]:[&_span]:translate-x-5.5 data-[state=checked]:[&_span]:rtl:-translate-x-5.5'
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                  />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className='w-72'>
                  {checked ? (
                    <div className='flex flex-col items-center text-center'>
                      <span className='bg-green-600/10 mb-2.5 flex size-12 items-center justify-center rounded-full'>
                        <Play className='text-green-600 size-6' />
                      </span>
                      <div className='mb-1 text-lg font-medium'>{t("panel.page.cron-job.running.label")}</div>
                      <p className='text-sm text-muted-foreground'>{t("panel.page.cron-job.running.description")}</p>
                    </div>
                  ) : (
                    <div className='flex flex-col items-center text-center'>
                      <span className='bg-yellow-600/10 mb-2.5 flex size-12 items-center justify-center rounded-full'>
                        <Pause className='text-yellow-600 size-6' />
                      </span>
                      <div className='mb-1 text-lg font-medium'>{t("panel.page.cron-job.suspended.label")}</div>
                      <p className='text-sm text-muted-foreground'>{t("panel.page.cron-job.suspended.description")}</p>
                    </div>
                  )}
              </HoverCardContent>
            </HoverCard>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>
                    {t("panel.page.cron-job.actions")}
                    <ChevronDown
                      className={`ml-2 transition-transform duration-300 ${
                        actionsOpen ? 'scale-y-[-1]' : 'scale-y-100'
                      }`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuSeparator/>
                <DropdownMenuContent align="end">
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-rose-600 flex items-center gap-2">
                        <Trash2 className="text-rose-600" size={16}/>
                        {t("panel.page.cron-jobs.action.delete")}
                      </div>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <CronJobDeleteDialog
                namespace={cronJob ? cronJob.namespace : ""}
                cronJob={cronJob ? cronJob.name : ""}
                setOpen={setDeleteOpen}
                onDelete={() => replace("/cron-jobs/")}
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