import {ChevronsUpDown, UserRound} from "lucide-react"

import {Avatar, AvatarFallback,} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {Separator} from "@/components/ui/separator.tsx";
import {SettingsDialog} from "@/layouts/settings";
import {Dialog} from "@/components/ui/dialog.tsx";
import {
  SidebarUserDropdownContent
} from "@/layouts/panel/sidebar/user/dropdown-content.tsx";

export function SidebarUser(
  {
    user,
  }: {
    user: {
      name: string
      email: string
    }
  }
) {
  const {isMobile} = useSidebar()
  return (
    <SidebarMenu>
      <Separator className="my-2"/>
      <SidebarMenuItem>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg"><UserRound
                    className="size-5"/></AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4"/>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <SidebarUserDropdownContent user={user}/>
            </DropdownMenuContent>
          </DropdownMenu>
          <SettingsDialog/>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}