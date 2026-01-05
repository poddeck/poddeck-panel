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
import ReplicaSetService from "@/api/services/replica-set-service";

export default function ReplicaSetDeleteDialog(
  {
    namespace,
    replicaSet,
    setOpen,
    onDelete,
  }: {
    namespace?: string;
    replicaSet?: string;
    setOpen: (open: boolean) => void;
    onDelete?: () => void;
  }
) {
  const {t} = useTranslation();
  const [newReplicaSetName, setNewReplicaSetName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleDeleteReplicaSet = async () => {
    if (newReplicaSetName != replicaSet) {
      return;
    }
    setLoading(true);
    await ReplicaSetService.remove({
      namespace: namespace ? namespace : "",
      replica_set: replicaSet ? replicaSet : ""
    });
    setLoading(false);
    setNewReplicaSetName("");
    setOpen(false);
    onDelete?.();
  };
  return (
    <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}
                   onMouseDown={(e) => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>{t("panel.page.replica-sets.delete.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.page.replica-sets.delete.dialog.description")}
        </DialogDescription>
        <DialogDescription>
          {t("panel.page.replica-sets.delete.dialog.confirm.1")}
          <code className="bg-muted relative rounded mx-[0.2rem] px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary">
            {replicaSet}
          </code>
          {t("panel.page.replica-sets.delete.dialog.confirm.2")}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Input
            id="name"
            name="name"
            placeholder={t("panel.page.replica-sets.delete.dialog.name")}
            value={newReplicaSetName}
            onChange={(e) => setNewReplicaSetName(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline">{t("panel.page.replica-sets.delete.dialog.cancel")}</Button>
        </DialogClose>
        <Button variant="destructive" onClick={handleDeleteReplicaSet} disabled={loading || newReplicaSetName !== replicaSet}>
          {t("panel.page.replica-sets.delete.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}