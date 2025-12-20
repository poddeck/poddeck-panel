import {
  DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {LogOut, Settings, UserRound} from "lucide-react";
import {DialogTrigger} from "@/components/ui/dialog.tsx";
import {
  SidebarThemeSelector
} from "@/layouts/panel/sidebar/user/theme-selector.tsx";
import {
  SidebarLanguageSelector
} from "@/layouts/panel/sidebar/user/language-selector.tsx";
import {useTranslation} from "react-i18next";
import {useLogout} from "@/store/user-store.ts";

export function SidebarUserDropdownContent(
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
  const logout = useLogout();
  return (
    <>
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
    </>
  )
}