"use client"

import {Input} from "@/components/ui/input"
import {useTranslation} from "react-i18next";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import * as React from "react";
import CronJobService from "@/api/services/cron-job-service";

export default function CronJobDeleteDialog(
  {
    namespace,
    cronJob,
    setOpen,
    onDelete,
  }: {
    namespace?: string;
    cronJob?: string;
    setOpen: (open: boolean) => void;
    onDelete?: () => void;
  }
) {
  const {t} = useTranslation();
  const [newCronJobName, setNewCronJobName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleDeleteCronJob = async () => {
    if (newCronJobName != cronJob) {
      return;
    }
    setLoading(true);
    await CronJobService.remove({
      namespace: namespace ? namespace : "",
      cron_job: cronJob ? cronJob : ""
    });
    setLoading(false);
    setNewCronJobName("");
    setOpen(false);
    onDelete?.();
  };
  return (
    <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}
                   onMouseDown={(e) => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>{t("panel.page.cron-jobs.delete.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.page.cron-jobs.delete.dialog.description")}
        </DialogDescription>
        <DialogDescription>
          {t("panel.page.cron-jobs.delete.dialog.confirm.1")}
          <code className="bg-muted relative rounded mx-[0.2rem] px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary">
            {cronJob}
          </code>
          {t("panel.page.cron-jobs.delete.dialog.confirm.2")}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Input
            id="name"
            name="name"
            placeholder={t("panel.page.cron-jobs.delete.dialog.name")}
            value={newCronJobName}
            onChange={(e) => setNewCronJobName(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline">{t("panel.page.cron-jobs.delete.dialog.cancel")}</Button>
        </DialogClose>
        <Button variant="destructive" onClick={handleDeleteCronJob} disabled={loading || newCronJobName !== cronJob}>
          {t("panel.page.cron-jobs.delete.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}