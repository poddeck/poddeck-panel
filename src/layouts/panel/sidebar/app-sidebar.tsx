"use client"

import * as React from "react"
import {
  AlarmClock,
  Box,
  CalendarClock,
  CreditCard, Cylinder,
  Database, Download, Gauge, Group,
  House,
  LayoutGrid,
  Lock,
  Network,
  Rocket, SearchCheck,
  Server,
  Settings, Shield, SquareDashedMousePointer,
  Unplug,
  VectorSquare,
  Waypoints
} from "lucide-react"

import {SidebarClusterSwitcher} from "./cluster"
import {SidebarNavigation} from "./navigation"
import {SidebarUser} from "./user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {useTranslation} from "react-i18next";
import {useUserInformation} from "@/store/user-store.ts";

export function AppNavigation() {
  const {t} = useTranslation();
  return [
    {
      title: t("panel.sidebar.overview"),
      url: "/overview/",
      icon: House,
      isActive: false,
      items: [],
    },
    {
      title: t("panel.sidebar.nodes"),
      url: "/nodes/",
      icon: Server,
      isActive: false,
      items: [],
    },
    {
      title: t("panel.sidebar.workload"),
      url: "/workload/",
      icon: Gauge,
      isActive: false,
      items: [],
    },
    {
      title: t("panel.sidebar.namespaces"),
      url: "/namespaces/",
      icon: Group,
      isActive: false,
      items: [],
    },
    {
      title: t("panel.sidebar.events"),
      url: "/events/",
      icon: CalendarClock,
      isActive: false,
      items: [],
    },
    {
      title: t("panel.sidebar.units"),
      icon: LayoutGrid,
      isActive: true,
      items: [
        {
          title: t("panel.sidebar.pods"),
          url: "/pods/",
          icon: Box,
        },
        {
          title: t("panel.sidebar.deployments"),
          url: "/deployments/",
          icon: Rocket,
        },
        {
          title: t("panel.sidebar.daemon.sets"),
          url: "/daemon-sets/",
          icon: VectorSquare
        },
        {
          title: t("panel.sidebar.replica.sets"),
          url: "/replica-sets/",
          icon: Network
        },
        {
          title: t("panel.sidebar.stateful.sets"),
          url: "/stateful-sets/",
          icon: Database
        },
        {
          title: t("panel.sidebar.cron.jobs"),
          url: "/cron-jobs/",
          icon: AlarmClock
        },
      ],
    },
    {
      title: t("panel.sidebar.config"),
      icon: Settings,
      isActive: true,
      items: [
        {
          title: t("panel.sidebar.config.maps"),
          url: "/config-maps/",
          icon: CreditCard,
          disabled: true
        },
        {
          title: t("panel.sidebar.secrets"),
          url: "/secrets/",
          icon: Lock,
          disabled: true
        },
      ],
    },
    {
      title: t("panel.sidebar.network"),
      icon: Waypoints,
      isActive: true,
      items: [
        {
          title: t("panel.sidebar.services"),
          url: "/services/",
          icon: Unplug,
        },
      ],
    },
    {
      title: t("panel.sidebar.storage"),
      icon: Cylinder,
      isActive: true,
      items: [
        {
          title: t("panel.sidebar.pv"),
          url: "/pv/",
          icon: Database,
          disabled: true
        },
        {
          title: t("panel.sidebar.pvc"),
          url: "/pvc/",
          icon: SquareDashedMousePointer,
          disabled: true
        },
      ],
    },
    {
      title: t("panel.sidebar.security"),
      icon: Shield,
      isActive: true,
      items: [
        {
          title: t("panel.sidebar.updates"),
          url: "/updates/",
          icon: Download,
          notifications: 3,
          disabled: true
        },
        {
          title: t("panel.sidebar.audits"),
          url: "/audits/",
          icon: SearchCheck,
          disabled: true
        },
      ],
    }
  ];
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const userInformation = useUserInformation();
  const user = {
    name: userInformation?.name ?? "",
    email: userInformation?.email ?? "",
  };
  return (
    <div id="sidebar">
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarClusterSwitcher/>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavigation items={AppNavigation()}/>
        </SidebarContent>
        <SidebarFooter>
          <SidebarUser user={user}/>
        </SidebarFooter>
        <SidebarRail/>
      </Sidebar>
    </div>
  )
}
