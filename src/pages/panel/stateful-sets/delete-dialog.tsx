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
import StatefulSetService from "@/api/services/stateful-set-service";

export default function StatefulSetDeleteDialog(
  {
    namespace,
    statefulSet,
    setOpen,
    onDelete,
  }: {
    namespace?: string;
    statefulSet?: string;
    setOpen: (open: boolean) => void;
    onDelete?: () => void;
  }
) {
  const {t} = useTranslation();
  const [newStatefulSetName, setNewStatefulSetName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleDeleteStatefulSet = async () => {
    if (newStatefulSetName != statefulSet) {
      return;
    }
    setLoading(true);
    await StatefulSetService.remove({
      namespace: namespace ? namespace : "",
      stateful_set: statefulSet ? statefulSet : ""
    });
    setLoading(false);
    setNewStatefulSetName("");
    setOpen(false);
    onDelete?.();
  };
  return (
    <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}
                   onMouseDown={(e) => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>{t("panel.page.stateful-sets.delete.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.page.stateful-sets.delete.dialog.description")}
        </DialogDescription>
        <DialogDescription>
          {t("panel.page.stateful-sets.delete.dialog.confirm.1")}
          <code className="bg-muted relative rounded mx-[0.2rem] px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary">
            {statefulSet}
          </code>
          {t("panel.page.stateful-sets.delete.dialog.confirm.2")}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Input
            id="name"
            name="name"
            placeholder={t("panel.page.stateful-sets.delete.dialog.name")}
            value={newStatefulSetName}
            onChange={(e) => setNewStatefulSetName(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline">{t("panel.page.stateful-sets.delete.dialog.cancel")}</Button>
        </DialogClose>
        <Button variant="destructive" onClick={handleDeleteStatefulSet} disabled={loading || newStatefulSetName !== statefulSet}>
          {t("panel.page.stateful-sets.delete.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}