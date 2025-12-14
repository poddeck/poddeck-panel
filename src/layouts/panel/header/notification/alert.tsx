import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {useEffect, useRef} from "react";
import NotificationService, {
  type Notification
} from "@/api/services/notification-service";
import {CheckCircle, ScrollText, Siren, TriangleAlert} from "lucide-react";
import {Age} from "@/components/age/age.tsx";

interface NotificationAlertProps {
  cluster: boolean;
  notification: Notification;
  onSeen: (id: string) => void;
}

export default function NotificationAlert(
  {
    cluster,
    notification,
    onSeen,
  }: NotificationAlertProps
) {
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
      className={`mb-4 transition-colors flex items-start`}
    >
      <div className="mr-3 flex flex-col items-center flex-shrink-0 gap-2 w-8">
        <div className={color}>{icon}</div>
        <Age age={age} />
      </div>

      <div className="flex-1 flex flex-col justify-center gap-1">
        <AlertTitle className={`line-clamp-none whitespace-normal break-words ${color}`}>
          {notification.title}
        </AlertTitle>
        <AlertDescription className="whitespace-normal break-words">
          {notification.description}
        </AlertDescription>
        {!cluster && notification.cluster_found && (
          <span className="inline-block text-xs font-medium bg-primary/20 text-primary px-2 py-0.5 rounded-full w-fit">
            {notification.cluster_name}
          </span>
        )}
      </div>
    </Alert>
  );
}
