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
import PodService from "@/api/services/pod-service.ts";

export default function PodDeleteDialog(
  {
    namespace,
    pod,
    setOpen,
    onDelete,
  }: {
    namespace?: string;
    pod?: string;
    setOpen: (open: boolean) => void;
    onDelete?: () => void;
  }
) {
  const {t} = useTranslation();
  const [newPodName, setNewPodName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleEditPod = async () => {
    if (newPodName != pod) {
      return;
    }
    setLoading(true);
    await PodService.remove({
      namespace: namespace ? namespace : "",
      pod: pod ? pod : ""
    });
    setLoading(false);
    setNewPodName("");
    setOpen(false);
    onDelete?.();
  };
  return (
    <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}
                   onMouseDown={(e) => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>{t("panel.page.pods.delete.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.page.pods.delete.dialog.description")}
        </DialogDescription>
        <DialogDescription>
          {t("panel.page.pods.delete.dialog.confirm.1")}
          <code className="bg-muted relative rounded mx-[0.2rem] px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary">
            {pod}
          </code>
          {t("panel.page.pods.delete.dialog.confirm.2")}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Input
            id="name"
            name="name"
            placeholder={t("panel.page.pods.delete.dialog.name")}
            value={newPodName}
            onChange={(e) => setNewPodName(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline">{t("panel.page.pods.delete.dialog.cancel")}</Button>
        </DialogClose>
        <Button variant="destructive" onClick={handleEditPod} disabled={loading || newPodName !== pod}>
          {t("panel.page.pods.delete.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}