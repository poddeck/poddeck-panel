"use client"

import {Input} from "@/components/ui/input"
import {useTranslation} from "react-i18next";
import {
  DialogClose, DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import ClusterIconSelect from "@/layouts/panel/sidebar/cluster/icon-select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import * as React from "react";
import ClusterService from "@/api/services/cluster-service.ts";

export default function ClusterEditDialog({id, name, icon}: {
  id?: string;
  name?: string;
  icon?: string;
}) {
  const {t} = useTranslation();
  const [newClusterName, setNewClusterName] = React.useState(name ?? "");
  const [newClusterIcon, setNewClusterIcon] = React.useState(icon ?? "");
  const [loading, setLoading] = React.useState(false);
  const handleEditCluster = async () => {
    if (!newClusterName.trim() || !newClusterIcon.trim()) {
      return;
    }
    setLoading(true);
    await ClusterService.edit({
      id: id ? id : "",
      name: newClusterName,
      icon: newClusterIcon
    });
    window.location.reload();
  };
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{t("panel.sidebar.cluster.edit.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.sidebar.cluster.edit.dialog.description")}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label
            htmlFor="name">{t("panel.sidebar.cluster.edit.dialog.name")}</Label>
          <Input
            id="name"
            name="name"
            placeholder={t("panel.sidebar.cluster.edit.dialog.name")}
            value={newClusterName}
            onChange={(e) => setNewClusterName(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label>{t("panel.sidebar.cluster.icon.label")}</Label>
          <ClusterIconSelect value={newClusterIcon}
                             onChange={(value) => setNewClusterIcon(value)}/>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline">{t("panel.sidebar.cluster.edit.dialog.cancel")}</Button>
        </DialogClose>
        <Button onClick={handleEditCluster} disabled={loading}>
          {t("panel.sidebar.cluster.edit.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}