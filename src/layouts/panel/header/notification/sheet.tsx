import {POLL_INTERVAL_MS} from "@/lib/constants.ts";
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
import {useVirtualizer} from "@tanstack/react-virtual";
import NotificationService, {
  type Notification
} from "@/api/services/notification-service.ts";
import {useTranslation} from "react-i18next";
import NotificationAlert from "@/layouts/panel/header/notification/alert.tsx";

export default function NotificationSheet({cluster}: {cluster: boolean}) {
  const {t} = useTranslation();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchNotifications = () => {
      const result = cluster
        ? NotificationService.listCluster()
        : NotificationService.listAll();

      result.then(({ notifications }) => {
        setNotifications(notifications ?? []);
      });
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [cluster]);

  const virtualizer = useVirtualizer({
    count: notifications.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  const handleSeen = React.useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, state: "SEEN" } : n
      )
    );
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
        <div ref={scrollRef} className="relative flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              {t("panel.header.notifications.empty")}
            </p>
          ) : (
            <div
              className="relative w-full"
              style={{ height: virtualizer.getTotalSize() }}
            >
              {virtualizer.getVirtualItems().map(virtualItem => {
                const notification = notifications[virtualItem.index];
                return (
                  <div
                    key={notification.id}
                    data-index={virtualItem.index}
                    ref={virtualizer.measureElement}
                    className="absolute top-0 left-0 right-0 px-4 pb-4"
                    style={{ transform: `translateY(${virtualItem.start}px)` }}
                  >
                    <NotificationAlert
                      cluster={cluster}
                      notification={notification}
                      onSeen={handleSeen}
                    />
                  </div>
                );
              })}
            </div>
          )}
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