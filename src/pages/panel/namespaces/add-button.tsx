"use client"

import {Input} from "@/components/ui/input"
import {useTranslation} from "react-i18next";
import {
  Dialog,
  DialogClose, DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import * as React from "react";
import NamespaceService from "@/api/services/namespace-service.ts";
import {toast} from "sonner";
import {PlusIcon} from "lucide-react";

export default function NamespaceAddButton({ onCreation }: {
  onCreation?: () => void;
}) {
  const {t} = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [newNamespaceName, setNewNamespaceName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleCreateNamespace = async () => {
    if (!newNamespaceName.trim()) {
      return;
    }
    try {
      setLoading(true);
      await NamespaceService.create({name: newNamespaceName});
      onCreation?.();
    } finally {
      setLoading(false);
      setNewNamespaceName("");
      setOpen(false);
      toast.success(t("panel.page.namespaces.add.successful"), {
        position: "top-right",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size='lg' className='bg-primary'>
          <PlusIcon/>
          {t("panel.page.namespaces.add")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("panel.page.namespaces.add.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("panel.page.namespaces.add.dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label
              htmlFor="name">{t("panel.page.namespaces.add.dialog.name")}</Label>
            <Input
              id="name"
              name="name"
              placeholder={t("panel.page.namespaces.add.dialog.name")}
              value={newNamespaceName}
              onChange={(e) => setNewNamespaceName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline">{t("panel.page.namespaces.add.dialog.cancel")}</Button>
          </DialogClose>
          <Button onClick={handleCreateNamespace} disabled={loading}>
            {t("panel.page.namespaces.add.dialog.submit")}
            {loading && <Spinner className="ml-2"></Spinner>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}