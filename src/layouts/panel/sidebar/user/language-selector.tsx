import {BookA, ChevronRight} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useTranslation} from "react-i18next";
import {useSidebar} from "@/components/ui/sidebar.tsx";

export function SidebarLanguageSelector() {
  const {t, i18n} = useTranslation();
  const language = (i18n.resolvedLanguage || "en_US");
  const {isMobile} = useSidebar()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <DropdownMenuItem>
          <BookA/>
          {t("panel.sidebar.language")}
          <ChevronRight className="ml-auto"/>
        </DropdownMenuItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="start"
        sideOffset={4}
      >
        <DropdownMenuRadioGroup onValueChange={i18n.changeLanguage}
                                value={language}>
          <DropdownMenuRadioItem value="en_US">
            <span className="flex items-center gap-2">
              <span>🇺🇸</span>
              <span>English</span>
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="de_DE">
            <span className="flex items-center gap-2">
              <span>🇩🇪</span>
              <span>Deutsch</span>
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="es_DE">
            <span className="flex items-center gap-2">
              <span>🇪🇸</span>
              <span>Español</span>
            </span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}