import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from "@/components/ui/breadcrumb.tsx";
import {useTranslation} from "react-i18next";
import {AvatarFallback} from "@radix-ui/react-avatar";
import {Bell, CircleAlertIcon, XIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";
import {Avatar} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {useEffect, useState} from 'react'
import {Progress} from "@/components/ui/progress.tsx";

interface AppHeaderProps {
  title: string;
}

export function AppHeader({title}: AppHeaderProps) {
  const {t} = useTranslation();
  return (
    <header
      className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1"/>
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{t(title)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-auto mr-5">
            <div className='relative w-fit'>
              <Avatar className='size-5 rounded-sm'>
                <AvatarFallback className='rounded-sm'>
                  <Bell className='size-5'/>
                </AvatarFallback>
              </Avatar>
              <Badge
                className='absolute -top-2 -right-2 h-4 min-w-4 px-1 tabular-nums bg-red-500 text-white'>3</Badge>
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <ul className="px-4">
            <DemoLoaderAlert title="Security Update In Progress" description="A critical security patch is available for your Kubernetes version. Schedule an update to ensure cluster safety and compliance."></DemoLoaderAlert>
            <DemoMessageAlert title="Cluster Health Alert" description="One or more nodes in your cluster are reporting high CPU or memory usage. Check workloads to prevent potential performance issues."></DemoMessageAlert>
            <DemoMessageAlert title="Deployment Success" description="Your recent deployment to the production namespace completed successfully. All pods are running and ready."></DemoMessageAlert>
          </ul>
        </SheetContent>
      </Sheet>
    </header>
  );
}

interface DemoMessageProps {
  title: string;
  description: string;
}

function DemoMessageAlert({title, description}: DemoMessageProps) {
  const [isActive, setIsActive] = useState(true)
  if (!isActive) return null
  return (
    <Alert className='flex justify-between mb-4'>
      <CircleAlertIcon/>
      <div className='flex-1 flex-col justify-center gap-1'>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </div>
      <button className='cursor-pointer' onClick={() => setIsActive(false)}>
        <XIcon className='size-5'/>
        <span className='sr-only'>Close</span>
      </button>
    </Alert>
  );
}

function DemoLoaderAlert({title, description}: DemoMessageProps) {
  const [isActive, setIsActive] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(50), 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!isActive) return null

  return (
    <Alert className='flex justify-between mb-4'>
      <CircleAlertIcon/>
      <div className='flex-1 flex-col justify-center gap-1'>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        <Progress
          value={progress}
          className='bg-emerald-600/20 *:bg-emerald-600 dark:bg-emerald-400/20 dark:*:bg-emerald-400 mt-4'
          aria-label='Task progress'
        />
      </div>
      <button className='cursor-pointer' onClick={() => setIsActive(false)}>
        <XIcon className='size-5'/>
        <span className='sr-only'>Close</span>
      </button>
    </Alert>
  );
}