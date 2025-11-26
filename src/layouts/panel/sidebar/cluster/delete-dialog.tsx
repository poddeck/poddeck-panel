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
import ClusterService from "@/api/services/cluster-service.ts";

export default function ClusterDeleteDialog({id, name}: {
  id?: string;
  name?: string;
}) {
  const {t} = useTranslation();
  const [newClusterName, setNewClusterName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleEditCluster = async () => {
    if (newClusterName != name) {
      return;
    }
    setLoading(true);
    await ClusterService.remove({
      id: id ? id : "",
    });
    window.location.reload();
  };
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{t("panel.sidebar.cluster.delete.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.sidebar.cluster.delete.dialog.description")}
        </DialogDescription>
        <DialogDescription>
          {t("panel.sidebar.cluster.delete.dialog.confirm.1")}
          <b className="text-white">{name}</b>
          {t("panel.sidebar.cluster.delete.dialog.confirm.2")}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Input
            id="name"
            name="name"
            placeholder={t("panel.sidebar.cluster.delete.dialog.name")}
            value={newClusterName}
            onChange={(e) => setNewClusterName(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline">{t("panel.sidebar.cluster.delete.dialog.cancel")}</Button>
        </DialogClose>
        <Button variant="destructive" onClick={handleEditCluster} disabled={loading || newClusterName !== name}>
          {t("panel.sidebar.cluster.delete.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}