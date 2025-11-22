import PanelPage from "@/layouts/panel"
import {WorkloadChart} from "@/pages/panel/workload/workload-chart.tsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import * as React from "react";
import {
  Select,
  SelectContent, SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";
import {Server, TrendingDown, TrendingUp, TrendingUpDown} from "lucide-react";

export default function WorkloadPage() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const tabsTriggerClass = "bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none";
  return (
    <PanelPage title="panel.page.workload.title">
      <div className="flex items-center justify-between mb-[4vh]">
        <Tabs defaultValue="average">
          <TabsList className="bg-background rounded-none border-b p-0">
            <TabsTrigger value="average" className={tabsTriggerClass}><TrendingUpDown/> Average</TabsTrigger>
            <TabsTrigger value="maximum" className={tabsTriggerClass}><TrendingUp/> Maximum</TabsTrigger>
            <TabsTrigger value="minimum" className={tabsTriggerClass}><TrendingDown/> Minimum</TabsTrigger>
            <TabsTrigger value="node" className={tabsTriggerClass}><Server/> Node</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <WorkloadChart id="cpu" title="CPU" usage="23%" color="oklch(0.75 0.14 233)" timeRange={timeRange}/>
        <WorkloadChart id="memory" title="Memory" usage="68%" relation="(5.1 GB / 7.6 GB)" color="oklch(0.77 0.15 163)" timeRange={timeRange}/>
        <WorkloadChart id="storage" title="Storage" usage="75%" relation="(53.9 GB / 74.8 GB)" color="oklch(0.75 0.21 322)" timeRange={timeRange}/>
      </div>
    </PanelPage>
  )
}
