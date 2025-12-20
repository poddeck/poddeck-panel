import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from "@/components/ui/breadcrumb.tsx";
import {useTranslation} from "react-i18next";
import {PlusIcon, UserRound} from "lucide-react";
import {Button} from "@/components/ui/button";
import * as React from 'react'
import {HeaderSearchBar} from "./search-bar";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import ResourceAddDialog from "@/layouts/panel/header/resource-add-dialog.tsx";
import NotificationSheet from "@/layouts/panel/header/notification/sheet.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {
  SidebarUserDropdownContent
} from "@/layouts/panel/sidebar/user/dropdown-content.tsx";
import {SettingsDialog} from "@/layouts/settings";
import {useUserInformation} from "@/store/user-store.ts";

interface AppHeaderProps {
  title?: string;
  breadcrumb?: React.ReactNode;
  cluster?: boolean
}

export function AppHeader(
  {
    title,
    breadcrumb,
    cluster = true
  }: AppHeaderProps
) {
  const {t} = useTranslation();
  const [open, setOpen] = React.useState(false);
  const userInformation = useUserInformation();
  const user = {
    name: userInformation?.name ?? "",
    email: userInformation?.email ?? "",
  };

  return (
    <header
      className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b-1">
      <div className="flex items-center gap-2 px-4">
        {cluster ?
          (
            <SidebarTrigger className="-ml-1"/>
          ) : (
            <span className="mr-2 text-xl font-bold cursor-default">
              PodDeck
            </span>
          )
        }
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {title ?
          (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{t(title)}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          ) : breadcrumb
        }
      </div>
      <div
        className="flex align-center ml-auto mr-4 h-5 items-center space-x-4">
        {cluster && (
          <>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="mr-0">
                <Button
                  className="bg-secondary text-primary hover:bg-black/20 dark:hover:bg-white/20"
                  size="sm"
                >
                  <PlusIcon/>
                  {t("panel.header.resources.add")}
                </Button>
              </DialogTrigger>
              <ResourceAddDialog setOpen={setOpen}/>
            </Dialog>
            <Separator orientation="vertical" className="ml-5 mr-5 hidden md:block"/>
          </>
        )}
        <HeaderSearchBar/>
        <Separator orientation="vertical"
                   className="ml-5 mr-3 hidden md:block"/>
        <NotificationSheet cluster={cluster}/>
        {!cluster && (
          <>
            <Separator orientation="vertical"
                       className="mr-3 hidden md:block"/>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2">
                    <div className='relative w-fit'>
                      <Avatar className='size-5 rounded-sm'>
                        <AvatarFallback className='rounded-sm bg-transparent'>
                          <UserRound className='size-5'/>
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="top"
                  align="end"
                  sideOffset={4}
                >
                  <SidebarUserDropdownContent user={user}/>
                </DropdownMenuContent>
              </DropdownMenu>
              <SettingsDialog/>
            </Dialog>
          </>
        )}
      </div>
    </header>
  );
}