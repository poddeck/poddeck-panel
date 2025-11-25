import {
  ChevronsUpDown,
  LogOut, Settings,
  UserRound
} from "lucide-react"

import {Avatar, AvatarFallback,} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {useLogout} from "@/store/user-store";
import {useTranslation} from "react-i18next";
import {SidebarThemeSelector} from "./theme-selector.tsx";
import {SidebarLanguageSelector} from "./language-selector.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {SettingsDialog} from "@/layouts/settings";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";

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
  const {t} = useTranslation();
  const {isMobile} = useSidebar()
  const logout = useLogout();

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
              <DropdownMenuLabel className="p-0 font-normal">
                <div
                  className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      <UserRound className="size-5"/>
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuGroup>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <Settings/>
                    {t("panel.sidebar.settings")}
                  </DropdownMenuItem>
                </DialogTrigger>
                <SidebarThemeSelector/>
                <SidebarLanguageSelector/>
              </DropdownMenuGroup>
              <DropdownMenuSeparator/>
              <DropdownMenuItem onClick={async () => await logout()}>
                <LogOut/>
                {t("panel.sidebar.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SettingsDialog/>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}