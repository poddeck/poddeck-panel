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
import React from "react"
import {useTranslation} from "react-i18next";
import {cn} from "@/lib/utils.ts";

const RESOURCE_LIMIT = 100
const RESOURCE_PER_POD_CPU = 7
const RESOURCE_PER_POD_RAM = 5

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

export function DeploymentScaleDrawer() {
  const {t} = useTranslation();
  const [pods, setPods] = React.useState<number | "">(5)

  function adjust(amount: number) {
    setPods((prev) => {
      const cur = typeof prev === "number" ? prev : 0
      return Math.max(0, cur + amount)
    })
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
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

  const cpuUnits = (typeof pods === "number" ? pods : 0) * RESOURCE_PER_POD_CPU
  const ramUnits = (typeof pods === "number" ? pods : 0) * RESOURCE_PER_POD_RAM

  const cpuPercent = (cpuUnits / RESOURCE_LIMIT) * 100
  const ramPercent = (ramUnits / RESOURCE_LIMIT) * 100

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
                value={pods === "" ? "" : pods}
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
                percent={ramPercent} color={"bg-emerald-400"}/>
            </div>
          </div>

        </div>

        <DrawerFooter>
          <Button>{t("panel.page.deployment.scale.submit")}</Button>
          <DrawerClose asChild>
            <Button
              variant="outline">{t("panel.page.deployment.scale.cancel")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  )
}
