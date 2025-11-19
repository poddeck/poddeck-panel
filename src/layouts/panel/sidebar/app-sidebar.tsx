"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Rocket,
  Bug,
  Settings2,
  SquareTerminal,
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

// This is sample data.
const data = {
  user: {
    name: "Lukas",
    email: "lukas@poddeck.io"
  },
  clusters: [
    {
      name: "Production",
      logo: Rocket,
    },
    {
      name: "Staging",
      logo: Bug,
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ]
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarClusterSwitcher clusters={data.clusters}/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation items={data.navMain}/>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={data.user}/>
      </SidebarFooter>
      <SidebarRail/>
    </Sidebar>
  )
}
