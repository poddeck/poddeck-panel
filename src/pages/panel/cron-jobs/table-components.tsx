import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal, Trash2} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {type CronJob} from "@/api/services/cron-job-service"
import {t} from "@/locales/i18n";
import CronJobDeleteDialog from "@/pages/panel/cron-jobs/delete-dialog.tsx";
import React from "react";
import {Dialog} from "@radix-ui/react-dialog";
import {Badge} from "@/components/ui/badge.tsx";

export function CronJobsActionDropdown({cronJob}: { cronJob: CronJob }) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-fit hover:bg-black/10 dark:hover:bg-white/10 py-2 -my-2 rounded-full"
          >
            <MoreHorizontal/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteOpen(true);
            }}
          >
            <div className="text-rose-600 flex items-center gap-2">
              <Trash2 className="text-rose-600" size={16}/>
              {t("panel.page.cron-jobs.action.delete")}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <CronJobDeleteDialog
          namespace={cronJob.namespace}
          cronJob={cronJob.name}
          setOpen={setDeleteOpen}
        />
      </Dialog>
    </div>
  );
}

export function CronJobsSuspendStatus({suspend}: { suspend: boolean }) {
  if (suspend) {
    return <Badge
      className="px-4 py-2 -my-2 bg-yellow-600/10 text-yellow-600">
      {t("panel.page.cron-job.suspended.label")}
    </Badge>;
  } else {
    return <Badge
      className="px-4 py-2 -my-2 bg-green-600/10 text-green-600">
      {t("panel.page.cron-job.running.label")}
    </Badge>;
  }
}