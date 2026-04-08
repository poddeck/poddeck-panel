"use client"

import {useTranslation} from "react-i18next";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Copy, Check} from "lucide-react";
import * as React from "react";
import {toast} from "sonner";

interface DeployDialogProps {
  clusterId: string;
  agentKey: string;
  onClose?: () => void;
}

export default function ClusterDeployDialog({clusterId, agentKey, onClose}: DeployDialogProps) {
  const {t} = useTranslation();
  const [copiedHelm, setCopiedHelm] = React.useState(false);

  const helmCommand = `helm repo add poddeck https://poddeck.github.io/poddeck-charts
helm install poddeck-agent poddeck/poddeck-agent \\
  --set core.hostname=<YOUR_CORE_HOSTNAME> \\
  --set core.port=10101 \\
  --set cluster.id=${clusterId} \\
  --set cluster.key=${agentKey}`;

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedHelm(true);
    toast.success(t("panel.sidebar.cluster.deploy.dialog.copied"), {
      position: "top-right",
    });
    setTimeout(() => setCopiedHelm(false), 2000);
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{t("panel.sidebar.cluster.deploy.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.sidebar.cluster.deploy.dialog.description")}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t("panel.sidebar.cluster.deploy.dialog.helm.title")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(helmCommand)}
            >
              {copiedHelm ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
            </Button>
          </div>
          <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto whitespace-pre-wrap break-all font-mono">
            {helmCommand}
          </pre>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={onClose}>{t("panel.sidebar.cluster.deploy.dialog.close")}</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
