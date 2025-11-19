import {MonitorCog, Moon, Sun, SunMoon} from "lucide-react"

import {useTheme} from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useSidebar,} from "@/components/ui/sidebar"
import {useTranslation} from "react-i18next";

export function SidebarThemeSelector() {
  const {t} = useTranslation();
  const {theme, setTheme} = useTheme();
  const {isMobile} = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <DropdownMenuItem>
          <SunMoon/>
          {t("panel.sidebar.theme")}
        </DropdownMenuItem>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="start"
        sideOffset={4}
      >
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">
            <Sun className="mr-2"/>
            {t("panel.sidebar.theme.light")}
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="dark">
            <Moon className="mr-2"/>
            {t("panel.sidebar.theme.dark")}
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="system">
            <MonitorCog className="mr-2"/>
            {t("panel.sidebar.theme.system")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
