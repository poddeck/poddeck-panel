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
import NamespaceService from "@/api/services/namespace-service.ts";

export default function NamespaceDeleteDialog(
  {
    name,
    setOpen,
  }: {
    name?: string;
    setOpen: (open: boolean) => void;
  }
) {
  const {t} = useTranslation();
  const [newNamespaceName, setNewNamespaceName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleEditNamespace = async () => {
    if (newNamespaceName != name) {
      return;
    }
    setLoading(true);
    await NamespaceService.remove({
      name: name ? name : "",
    });
    setLoading(false);
    setNewNamespaceName("");
    setOpen(false);
  };
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{t("panel.page.namespaces.delete.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.page.namespaces.delete.dialog.description")}
        </DialogDescription>
        <DialogDescription>
          {t("panel.page.namespaces.delete.dialog.confirm.1")}
          <code className="bg-muted relative rounded mx-[0.2rem] px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary">
            {name}
          </code>
          {t("panel.page.namespaces.delete.dialog.confirm.2")}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Input
            id="name"
            name="name"
            placeholder={t("panel.page.namespaces.delete.dialog.name")}
            value={newNamespaceName}
            onChange={(e) => setNewNamespaceName(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline">{t("panel.page.namespaces.delete.dialog.cancel")}</Button>
        </DialogClose>
        <Button variant="destructive" onClick={handleEditNamespace} disabled={loading || newNamespaceName !== name}>
          {t("panel.page.namespaces.delete.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}