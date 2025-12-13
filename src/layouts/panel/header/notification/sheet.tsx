import {
  Sheet,
  SheetContent,
  SheetHeader, SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Avatar} from "@/components/ui/avatar.tsx";
import {AvatarFallback} from "@radix-ui/react-avatar";
import {Bell} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";
import * as React from "react";
import NotificationService, {
  type Notification
} from "@/api/services/notification-service.ts";
import Alert
  from "@/layouts/panel/header/notification/alert.tsx";
import {useTranslation} from "react-i18next";

export default function NotificationSheet() {
  const {t} = useTranslation();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    NotificationService.listAll().then(({ notifications }) => {
      setNotifications(notifications);
    });
  }, []);

  const unseenCount = notifications.filter(n => n.state !== "SEEN").length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2">
          <div className='relative w-fit'>
            <Avatar className='size-5 rounded-sm'>
              <AvatarFallback className='rounded-sm'>
                <Bell className='size-5'/>
              </AvatarFallback>
            </Avatar>
            {unseenCount > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-4 min-w-4 px-0.5 tabular-nums bg-red-500 text-white outline-2 outline-background"
              >
                {unseenCount}
              </Badge>
            )}
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("panel.header.notifications.title")}</SheetTitle>
        </SheetHeader>
        <div className="relative flex-1 overflow-y-auto">
          <ul className="px-4">
            {notifications.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                {t("panel.header.notifications.empty")}
              </p>
            )}

            {notifications.map(notification => (
              <Alert
                key={notification.id}
                notification={notification}
                onSeen={(id) =>
                  setNotifications(prev =>
                    prev.map(n =>
                      n.id === id ? { ...n, state: "SEEN" } : n
                    )
                  )
                }
              />
            ))}
          </ul>
          <div
            className="
              pointer-events-none
              sticky
              bottom-0
              left-0
              h-20
              w-full
              bg-gradient-to-t
              from-background
              to-transparent
            "
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}