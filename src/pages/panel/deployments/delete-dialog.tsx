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
import DeploymentService from "@/api/services/deployment-service";

export default function DeploymentDeleteDialog(
  {
    namespace,
    deployment,
    setOpen,
    onDelete,
  }: {
    namespace?: string;
    deployment?: string;
    setOpen: (open: boolean) => void;
    onDelete?: () => void;
  }
) {
  const {t} = useTranslation();
  const [newDeploymentName, setNewDeploymentName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleEditDeployment = async () => {
    if (newDeploymentName != deployment) {
      return;
    }
    setLoading(true);
    await DeploymentService.remove({
      namespace: namespace ? namespace : "",
      deployment: deployment ? deployment : ""
    });
    setLoading(false);
    setNewDeploymentName("");
    setOpen(false);
    onDelete?.();
  };
  return (
    <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}
                   onMouseDown={(e) => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>{t("panel.page.deployments.delete.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.page.deployments.delete.dialog.description")}
        </DialogDescription>
        <DialogDescription>
          {t("panel.page.deployments.delete.dialog.confirm.1")}
          <code className="bg-muted relative rounded mx-[0.2rem] px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary">
            {deployment}
          </code>
          {t("panel.page.deployments.delete.dialog.confirm.2")}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Input
            id="name"
            name="name"
            placeholder={t("panel.page.deployments.delete.dialog.name")}
            value={newDeploymentName}
            onChange={(e) => setNewDeploymentName(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline">{t("panel.page.deployments.delete.dialog.cancel")}</Button>
        </DialogClose>
        <Button variant="destructive" onClick={handleEditDeployment} disabled={loading || newDeploymentName !== deployment}>
          {t("panel.page.deployments.delete.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}