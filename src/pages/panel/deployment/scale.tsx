import {Minus, Plus} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {Input} from "@/components/ui/input.tsx"
import {useTranslation} from "react-i18next";
import {cn} from "@/lib/utils.ts";
import DeploymentService, {type Deployment} from "@/api/services/deployment-service.ts";
import {Spinner} from "@/components/ui/spinner.tsx";
import NodeService, {type Node} from "@/api/services/node-service.ts";
import {type ChangeEvent, useEffect, useMemo, useState} from "react";

function DeploymentScaleDrawerWorkload(
  {
    name,
    percent,
    color
  }: {
    name: string,
    percent: number,
    color: string
  }
) {
  const {t} = useTranslation();
  const normal = Math.min(percent, 100)
  const excess = Math.max(percent - 100, 0)
  return (
    <div className="mb-5">
      <div className="mb-1 text-sm text-muted-foreground flex justify-between">
        <span>{t(name)}</span>
        <span>{Math.round(normal)}%</span>
      </div>

      <div
        className="w-full h-4 bg-muted rounded-full relative overflow-visible mb-4">
        <div
          className={cn("h-full rounded-full transition-all duration-300", color)}
          style={{width: `${normal}%`}}
        />
      </div>

      {excess > 0 && (
        <>
          <div
            className="mb-1 text-sm text-muted-foreground flex justify-between text-red-400">
            <span>{t("panel.page.deployment.scale.overload")}</span>
            <span>{Math.round(excess)}%</span>
          </div>
          <div
            className="w-full h-3 bg-muted rounded-full relative overflow-visible">
            <div
              className="h-full rounded-full transition-all duration-300 bg-red-400"
              style={{width: `${Math.min(excess, 100)}%`}}
            />
          </div>
        </>
      )}
    </div>
  )
}

export function DeploymentScaleDrawer(
  {
    deployment,
    open,
    setOpen
  }: {
    deployment: Deployment | null,
    open: boolean,
    setOpen: (open: boolean) => void
  }
  ) {
  const {t} = useTranslation();
  const [pods, setPods] = useState<number | "">(1);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [nodes, setNodes] = useState<Node[] | null>(null);
  const [loadingNodes, setLoadingNodes] = useState(false);

  useEffect(() => {
    if (!initialized && deployment) {
      setPods(deployment.replicas);
      setInitialized(true);
    }
  }, [deployment, initialized]);

  useEffect(() => {
    async function fetchNodes() {
      setLoadingNodes(true);
      try {
        const response = await NodeService.list();
        setNodes(response.nodes);
      } catch (err) {
        console.error("Failed to load nodes", err);
        setNodes([]);
      } finally {
        setLoadingNodes(false);
      }
    }
    fetchNodes();
  }, [open]);

  function adjust(amount: number) {
    setPods((prev) => {
      const cur = typeof prev === "number" ? prev : 0
      return Math.max(0, cur + amount)
    })
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    if (v === "") {
      setPods("")
      return
    }
    const num = parseInt(v, 10)
    if (!isNaN(num)) {
      setPods(Math.max(0, num))
    }
  }

  function handleInputBlur() {
    if (pods === "") {
      setPods(1)
    }
  }

  async function submit() {
    setLoading(true);
    await DeploymentService.scale({
      namespace: deployment ? deployment.namespace : "",
      deployment: deployment ? deployment.name : "",
      replicas: pods === "" ? (deployment ? deployment.replicas : 1) : pods
    });
    setLoading(false);
    setOpen(false);
  }
  const totalCpuCapacity = useMemo(() => {
    if (!nodes) return 0;
    return nodes.reduce((sum, n) => sum + n.total_cpu_capacity, 0);
  }, [nodes]);
  const totalMemoryCapacity = useMemo(() => {
    if (!nodes) return 0;
    return nodes.reduce((sum, n) => sum + n.total_memory_capacity, 0);
  }, [nodes]);
  const totalAllocatedCpu = useMemo(() => {
    if (!nodes) return 0;
    return nodes.reduce((sum, n) => sum + n.allocated_cpu_capacity, 0);
  }, [nodes]);
  const totalAllocatedMemory = useMemo(() => {
    if (!nodes) return 0;
    return nodes.reduce((sum, n) => sum + n.allocated_memory_capacity, 0);
  }, [nodes]);

  const existingReplicas = deployment?.replicas ?? 0;
  const podCount = typeof pods === "number" ? pods : 0;
  const newPods = Math.max(0, podCount - existingReplicas);
  const requestedCpu = newPods * (deployment?.container_cpu_request ?? 0);
  const requestedMemory = newPods * (deployment?.container_memory_request ?? 0);
  const cpuPercent = totalCpuCapacity > 0
    ? ((totalAllocatedCpu + requestedCpu) / totalCpuCapacity) * 100
    : 0;
  const memoryPercent = totalMemoryCapacity > 0
    ? ((totalAllocatedMemory + requestedMemory) / totalMemoryCapacity) * 100
    : 0;

  if (loadingNodes) {
    return (
      <DrawerContent>
        <div className="flex items-center justify-center p-8">
          <Spinner />
        </div>
      </DrawerContent>
    );
  }

  return (
    <DrawerContent>
      <div className="mx-auto w-[min(calc(1500px,95%))] max-w-sm">
        <DrawerHeader>
          <DrawerTitle>{t("panel.page.deployment.scale.title")}</DrawerTitle>
          <DrawerDescription>{t("panel.page.deployment.scale.description")}</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 pb-0">

          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => adjust(-1)}
              disabled={typeof pods === 'number' ? pods <= 0 : false}
            >
              <Minus/>
            </Button>

            <div className="flex flex-col items-center flex-1">
              <Input
                type="number"
                value={pods}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onFocus={(event) => event.target.select()}
                className="w-24 text-center text-3xl! h-12 border-none bg-transparent! [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min={0}
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => adjust(1)}
            >
              <Plus/>
            </Button>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-2 gap-4 items-start">
              <DeploymentScaleDrawerWorkload
                name={t("panel.page.deployment.scale.cpu")} percent={cpuPercent}
                color={"bg-sky-400"}/>
              <DeploymentScaleDrawerWorkload
                name={t("panel.page.deployment.scale.memory")}
                percent={memoryPercent} color={"bg-emerald-400"}/>
            </div>
          </div>

        </div>

        <DrawerFooter>
          <Button onClick={submit} disabled={loading}>
            {t("panel.page.deployment.scale.submit")}
            {loading && <Spinner className="ml-2"></Spinner>}
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline">{t("panel.page.deployment.scale.cancel")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  )
}
