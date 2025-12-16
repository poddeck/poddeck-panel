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
import ServiceService from "@/api/services/service-service";

export default function ServiceDeleteDialog(
  {
    namespace,
    service,
    setOpen,
    onDelete,
  }: {
    namespace?: string;
    service?: string;
    setOpen: (open: boolean) => void;
    onDelete?: () => void;
  }
) {
  const {t} = useTranslation();
  const [newServiceName, setNewServiceName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleDeleteService = async () => {
    if (newServiceName != service) {
      return;
    }
    setLoading(true);
    await ServiceService.remove({
      namespace: namespace ? namespace : "",
      service: service ? service : ""
    });
    setLoading(false);
    setNewServiceName("");
    setOpen(false);
    onDelete?.();
  };
  return (
    <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}
                   onMouseDown={(e) => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>{t("panel.page.services.delete.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.page.services.delete.dialog.description")}
        </DialogDescription>
        <DialogDescription>
          {t("panel.page.services.delete.dialog.confirm.1")}
          <code className="bg-muted relative rounded mx-[0.2rem] px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary">
            {service}
          </code>
          {t("panel.page.services.delete.dialog.confirm.2")}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Input
            id="name"
            name="name"
            placeholder={t("panel.page.services.delete.dialog.name")}
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline">{t("panel.page.services.delete.dialog.cancel")}</Button>
        </DialogClose>
        <Button variant="destructive" onClick={handleDeleteService} disabled={loading || newServiceName !== service}>
          {t("panel.page.services.delete.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}