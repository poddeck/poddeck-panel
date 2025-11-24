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
import ClusterService, {type Cluster} from "@/api/services/cluster-service.ts";
import {toast} from "sonner";

export default function ClusterAddDialog({ onCreation }: {
  onCreation?: (cluster: Cluster) => void;
}) {
  const {t} = useTranslation();
  const [newClusterName, setNewClusterName] = React.useState("");
  const [newClusterIcon, setNewClusterIcon] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleCreateCluster = async () => {
    if (!newClusterName.trim() || !newClusterIcon.trim()) {
      return;
    }
    try {
      setLoading(true);
      const createResponse = await ClusterService.create({name: newClusterName, icon: newClusterIcon});
      const listResponse = await ClusterService.list();
      const cluster = listResponse.clusters.filter((entry: Cluster) => entry.id === createResponse.cluster)[0];
      onCreation?.(cluster);
      setNewClusterName("");
      setNewClusterIcon("");
    } finally {
      setLoading(false);
      toast.success(t("panel.sidebar.cluster.add.successful"), {
        position: "top-right",
      });
    }
  };
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{t("panel.sidebar.cluster.add.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.sidebar.cluster.add.dialog.description")}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label
            htmlFor="name">{t("panel.sidebar.cluster.add.dialog.name")}</Label>
          <Input
            id="name"
            name="name"
            placeholder={t("panel.sidebar.cluster.add.dialog.name")}
            value={newClusterName}
            onChange={(e) => setNewClusterName(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label>{t("panel.sidebar.cluster.add.dialog.icon.label")}</Label>
          <ClusterIconSelect onChange={(value) => setNewClusterIcon(value)}/>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline">{t("panel.sidebar.cluster.add.dialog.cancel")}</Button>
        </DialogClose>
        <Button onClick={handleCreateCluster} disabled={loading}>
          {t("panel.sidebar.cluster.add.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}