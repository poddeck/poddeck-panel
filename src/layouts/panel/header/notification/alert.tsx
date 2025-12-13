import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useRef } from "react";
import NotificationService, { type Notification } from "@/api/services/notification-service";
import { TriangleAlert, Siren, CheckCircle, ScrollText } from "lucide-react";
import { NotificationAge } from "./age";

interface NotificationAlertProps {
  notification: Notification;
  onSeen: (id: string) => void;
}

export default function NotificationAlert({
                                            notification,
                                            onSeen,
                                          }: NotificationAlertProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (notification.state === "SEEN") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          NotificationService.markSeen({ notification: notification.id }).then(() =>
            onSeen(notification.id)
          );
          observer.disconnect();
        }
      },
      { threshold: [0.5] }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [notification.id, notification.state, onSeen]);

  let color = "text-primary";
  let icon = <ScrollText size={20} />;

  switch (notification.type) {
    case "WARNING":
      color = "text-amber-500";
      icon = <TriangleAlert size={20} />;
      break;
    case "ERROR":
      color = "text-rose-500";
      icon = <Siren size={20} />;
      break;
    case "SUCCESS":
      color = "text-emerald-500";
      icon = <CheckCircle size={20} />;
      break;
  }

  const age = Date.now() - notification.created_at;

  return (
    <Alert
      ref={ref}
      className={`mb-4 transition-colors flex items-start ${
        notification.state !== "SEEN" ? "border-primary/40 bg-primary/5" : ""
      }`}
    >
      <div className={`mr-3 flex-shrink-0 ${color}`}>{icon}</div>

      <div className="flex-1 flex flex-col justify-center gap-1">
        <div className={`flex justify-between items-center ${color}`}>
          <AlertTitle>{notification.title}</AlertTitle>
          <NotificationAge age={age} />
        </div>
        <AlertDescription>{notification.description}</AlertDescription>
        {notification.cluster_found && (
          <span className="text-xs opacity-60">
            Cluster: {notification.cluster_name}
          </span>
        )}
      </div>
    </Alert>
  );
}
