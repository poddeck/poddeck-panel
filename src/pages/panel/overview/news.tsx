"use client"

import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import {
  CheckCircle,
  Newspaper,
  ScrollText,
  Siren,
  TriangleAlert
} from "lucide-react";
import NotificationService, {
  type Notification
} from "@/api/services/notification-service.ts";
import {Age} from "@/components/age/age.tsx";

const getNotificationIconAndColor = (type: Notification['type']) => {
  switch (type) {
    case "WARNING":
      return { icon: <TriangleAlert size={16} />, color: "text-amber-500" };
    case "ERROR":
      return { icon: <Siren size={16} />, color: "text-rose-500" };
    case "SUCCESS":
      return { icon: <CheckCircle size={16} />, color: "text-emerald-500" };
    default:
      return { icon: <ScrollText size={16} />, color: "text-primary" };
  }
};

export default function OverviewNewsBox() {
  const {t} = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const result = await NotificationService.listAll();
      if (result.notifications) {
        setNotifications(result.notifications);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Newspaper size={18} className="-translate-y-0.5"/>
          {t("panel.page.overview.news.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="relative max-h-120 overflow-hidden">

            <div className="flex flex-col gap-3 pr-2 overflow-y-auto h-120 custom-scroll">
              {notifications.map(notification => {
                const { icon, color } = getNotificationIconAndColor(notification.type);
                const age = Date.now() - notification.created_at;

                return (
                  <div key={notification.id} className="flex items-start gap-2 p-2 -m-2">
                    <div className={`mt-0.5 flex-shrink-0 ${color}`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${color}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {notification.description}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground flex-shrink-0">
                      <Age age={age} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none
              bg-gradient-to-t from-card to-transparent"
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {t("panel.header.notifications.empty")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}