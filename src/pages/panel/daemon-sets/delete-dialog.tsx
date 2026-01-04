"use client"

import {Input} from "@/components/ui/input"
import {useTranslation} from "react-i18next";
import {
  DialogClose, DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import * as React from "react";
import DaemonSetService from "@/api/services/daemon-set-service";

export default function DaemonSetDeleteDialog(
  {
    namespace,
    daemonSet,
    setOpen,
    onDelete,
  }: {
    namespace?: string;
    daemonSet?: string;
    setOpen: (open: boolean) => void;
    onDelete?: () => void;
  }
) {
  const {t} = useTranslation();
  const [newDaemonSetName, setNewDaemonSetName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleDeleteDaemonSet = async () => {
    if (newDaemonSetName != daemonSet) {
      return;
    }
    setLoading(true);
    await DaemonSetService.remove({
      namespace: namespace ? namespace : "",
      daemon_set: daemonSet ? daemonSet : ""
    });
    setLoading(false);
    setNewDaemonSetName("");
    setOpen(false);
    onDelete?.();
  };
  return (
    <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}
                   onMouseDown={(e) => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>{t("panel.page.daemon-sets.delete.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.page.daemon-sets.delete.dialog.description")}
        </DialogDescription>
        <DialogDescription>
          {t("panel.page.daemon-sets.delete.dialog.confirm.1")}
          <code className="bg-muted relative rounded mx-[0.2rem] px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary">
            {daemonSet}
          </code>
          {t("panel.page.daemon-sets.delete.dialog.confirm.2")}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Input
            id="name"
            name="name"
            placeholder={t("panel.page.daemon-sets.delete.dialog.name")}
            value={newDaemonSetName}
            onChange={(e) => setNewDaemonSetName(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline">{t("panel.page.daemon-sets.delete.dialog.cancel")}</Button>
        </DialogClose>
        <Button variant="destructive" onClick={handleDeleteDaemonSet} disabled={loading || newDaemonSetName !== daemonSet}>
          {t("panel.page.daemon-sets.delete.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}