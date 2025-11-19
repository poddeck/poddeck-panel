import {ChevronRight, type LucideIcon} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {Badge} from "@/components/ui/badge.tsx";

export function SidebarNavigation({
                                    items,
                                  }: {
  items: {
    title: string
    url?: string
    icon?: LucideIcon
    isActive?: boolean
    items: {
      title: string
      url: string,
      icon: LucideIcon,
      notifications?: number
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) =>
          item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon/>}
                    <span>{item.title}</span>
                    <ChevronRight
                      className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            {subItem.icon && <subItem.icon/>}
                            <span>{subItem.title}</span>
                            {subItem.notifications &&
                              <Badge
                                className="ml-auto h-5 min-w-5 rounded-full px-1 pt-1 font-mono tabular-nums">
                                {subItem.notifications}
                              </Badge>
                            }
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuSubItem key={item.title}>
              <SidebarMenuSubButton asChild>
                <a href={item.url}>
                  {item.icon && <item.icon/>}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}