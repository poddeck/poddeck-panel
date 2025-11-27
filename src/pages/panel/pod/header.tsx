import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Link, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
  Activity,
  Box,
  ChevronDown,
  Clock,
  Globe,
  Group,
  Server,
  Terminal,
  Trash2
} from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";
import PodHeaderStatus from "@/pages/panel/pod/status.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useState} from "react";
import type {Pod} from "@/api/services/pod-service.ts";
import {PodAge} from "@/pages/panel/pod/age.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

const tabs = [
  {
    id: "overview",
    name: "panel.page.pod.tabs.overview",
    url: "/pod/overview/"
  },
  {
    id: "logs",
    name: "panel.page.pod.tabs.logs",
    url: "/pod/logs/"
  },
  {
    id: "console",
    name: "panel.page.pod.tabs.console",
    url: "/pod/console/"
  },
  {
    id: "events",
    name: "panel.page.pod.tabs.events",
    url: "/pod/events/"
  },
]

export default function PodPageHeader(
  {
    pod,
    page
  }: {
    pod: Pod | null,
    page: string
  }
) {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  return (
    <div className="w-full bg-sidebar">
      <div className="w-[min(1500px,95%)] mx-auto flex flex-col flex-1">
        <div className="flex items-center justify-between pt-10 pb-8">
          <div className="flex items-center">
            <Box size={60} className="ml-2"/>
            <Separator orientation="vertical" className="mx-5 h-15!"/>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <PodHeaderStatus isActive={pod ? true : false}/>
                {pod ? (
                  <span className="text-xl pb-1">{pod.name}</span>
                ) : (
                  <Skeleton className="w-80 h-8"/>
                )}
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Activity size={16}/>
                  {pod ? (
                    <span>{pod.ready_containers} / {pod.total_containers}</span>
                  ) : (
                    <Skeleton className="w-15 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Group size={16}/>
                  {pod ? (
                    <span>{pod.namespace}</span>
                  ) : (
                    <Skeleton className="w-30 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Server size={16}/>
                  {pod ? (
                    <span>{pod.node}</span>
                  ) : (
                    <Skeleton className="w-25 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16}/>
                  {pod ? (
                    <span>{pod.ip}</span>
                  ) : (
                    <Skeleton className="w-30 h-6"/>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16}/>
                  {pod ? (
                    <PodAge age={pod!.age}/>
                  ) : (
                    <Skeleton className="w-8 h-6"/>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-5"
              onClick={() => {
                window.open("/pod/console/?" + searchParams.toString(), '_blank',
                  'location=yes,height=570,width=520,scrollbars=yes,status=yes');
              }}
            >
              <Terminal/>
            </Button>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  {t("panel.page.pod.actions")}
                  <ChevronDown
                    className={`ml-2 transition-transform duration-300 ${
                      open ? 'scale-y-[-1]' : 'scale-y-100'
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuSeparator/>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                  }}
                  className="text-rose-600 flex items-center gap-2"
                  variant='destructive'
                >
                  <Trash2 className="text-rose-600"
                          size={16}/> {t("panel.page.pods.action.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className='w-full max-w-md'>
          <Tabs defaultValue={page}>
            <TabsList className='bg-transparent rounded-none gap-2'>
              {tabs.map(tab => (
                <Link to={tab.url + "?" + searchParams.toString()}>
                  <TabsTrigger
                    value={tab.id}
                    className='bg-transparent! hover:text-primary! data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 mt-1.5 border-transparent data-[state=active]:shadow-none'
                  >
                    {t(tab.name)}
                  </TabsTrigger>
                </Link>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  )
}