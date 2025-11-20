import {
  DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import type {SettingsPage} from "@/pages/settings/settings-page.tsx";
import {useTranslation} from "react-i18next";
import type {LucideIcon} from "lucide-react";
import {AccountPage} from "@/pages/settings/account";
import {GeneralPage} from "@/pages/settings/general";
import {SecurityPage} from "@/pages/settings/security";
import {SessionsPage} from "@/pages/settings/sessions";
import {PersonalizationPage} from "@/pages/settings/personalization";

const pages: SettingsPage[] = [GeneralPage, AccountPage, PersonalizationPage, SecurityPage, SessionsPage];

export function SettingsDialog() {
  const {t} = useTranslation();
  const [currentPageKey, setCurrentPageKey] = useState(pages[0].key);
  const currentPage = pages.find((p) => p.key === currentPageKey)!;
  return (
    <DialogContent className="!max-w-[800px] p-0">
      <div className="flex h-[500px] w-full">
        <div className="w-[200px] bg-secondary/30 rounded-l-md p-4 flex flex-col space-y-2">
          {pages.map((page) => (
            <SidebarItem
              key={page.key}
              title={t(page.title)}
              icon={page.icon}
              isActive={currentPageKey === page.key}
              onClick={() => setCurrentPageKey(page.key)}
            />
          ))}
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <DialogHeader className="border-b-2 border-secondary">
            <DialogTitle className="pb-2">{t(currentPage.title)}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <currentPage.component />
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

interface SidebarItemProps {
  title: string;
  icon?: LucideIcon;
  isActive?: boolean;
  onClick: () => void;
}

export function SidebarItem({ title, icon: Icon, isActive, onClick }: SidebarItemProps) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="justify-start w-full"
      onClick={onClick}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <span>{title}</span>
    </Button>
  );
}
