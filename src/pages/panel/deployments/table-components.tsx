import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal, Scale, Trash2} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {type Deployment} from "@/api/services/deployment-service"
import {t} from "@/locales/i18n";
import {Badge} from "@/components/ui/badge.tsx";
import DeploymentDeleteDialog from "@/pages/panel/deployments/delete-dialog.tsx";
import React from "react";
import {DialogTrigger} from "@/components/ui/dialog.tsx";
import {Dialog} from "@radix-ui/react-dialog";
import {Drawer, DrawerTrigger} from "@/components/ui/drawer.tsx";
import {DeploymentScaleDrawer} from "@/pages/panel/deployment/scale.tsx";

export function DeploymentsActionDropdown({deployment}: { deployment: Deployment }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <Drawer>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-fit hover:bg-black/10 dark:hover:bg-white/10 py-2 -my-2 rounded-full">
                <MoreHorizontal/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DrawerTrigger asChild>
                <DropdownMenuItem
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <Scale size={16}/>
                    {t("panel.page.deployments.action.scale")}
                  </div>
                </DropdownMenuItem>
              </DrawerTrigger>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-rose-600 flex items-center gap-2">
                    <Trash2 className="text-rose-600" size={16}/>
                    {t("panel.page.deployments.action.delete")}
                  </div>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeploymentScaleDrawer/>
        </Drawer>
        <DeploymentDeleteDialog
          namespace={deployment.namespace}
          deployment={deployment.name}
          setOpen={setOpen}
        />
      </Dialog>
    </div>
  );
}

export function DeploymentsStatus({status}: {status: string}) {
  if (status === "pending") {
    return <Badge
      className="px-4 py-2 -my-2 bg-yellow-600/10 text-yellow-600">
      {t("panel.page.deployments.status.pending")}
    </Badge>;
  } else if (status === "running") {
    return <Badge
      className="px-4 py-2 -my-2 bg-green-600/10 text-green-600">
      {t("panel.page.deployments.status.running")}
    </Badge>;
  } else if (status === "succeeded") {
    return <Badge
      className="px-4 py-2 -my-2 bg-lime-600/10 text-lime-600">
      {t("panel.page.deployments.status.succeeded")}
    </Badge>;
  } else if (status === "failed") {
    return <Badge
      className="px-4 py-2 -my-2 bg-red-600/10 text-red-600">
      {t("panel.page.deployments.status.failed")}
    </Badge>;
  } else if (status === "unknown") {
    return <Badge
      className="px-4 py-2 -my-2 bg-zinc-400/10 text-zinc-400">
      {t("panel.page.deployments.status.unknown")}
    </Badge>;
  }
}