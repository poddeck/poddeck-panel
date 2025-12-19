import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal, Monitor, Smartphone, X} from "lucide-react";
import SettingsService, {
  type SessionInfo
} from "@/api/services/settings-service.ts";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";

export default function SessionsPageContent() {
  const {t} = useTranslation();
  const [sessions, setSessions] = React.useState<SessionInfo[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await SettingsService.listSessions();
        const sorted = [...response.sessions].sort(
          (a, b) =>
            new Date(b.openTime).getTime() - new Date(a.openTime).getTime()
        );
        setSessions(sorted);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  const removeSession = async (id: string) => {
    await SettingsService.closeSession({session: id});
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success(t("settings.sessions.close.successful"), {
      position: "top-right",
    });
  };

  if (loading) {
    return <div className="text-muted-foreground">{t("settings.sessions.loading")}…</div>;
  }

  return (
    <div className="space-y-4 max-w-3xl">
      {sessions.map((session) => (
        <SessionRow
          key={session.id}
          session={session}
          onDelete={removeSession}
        />
      ))}
    </div>
  );
}

function SessionRow(
  {
    session,
    onDelete,
  }: {
    session: SessionInfo;
    onDelete: (id: string) => void;
  }
) {
  const {t} = useTranslation();
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="flex items-center justify-between rounded-xl border px-4 py-3">
      <div className="flex items-start gap-3">
        {session.platform.toLowerCase().includes("mobile") ? (
          <Smartphone className="mt-2 size-4 text-muted-foreground"/>
        ) : (
          <Monitor className="mt-2 size-4 text-muted-foreground"/>
        )}

        <div className="space-y-1">
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600">
            {session.isCurrent ? t("settings.sessions.current") : t("settings.sessions.active")}
          </span>

          <div>
            <span className="text-sm">{session.platform}</span>
          </div>

          {session.city != "" && session.country != "" && (
            <div className="text-sm text-muted-foreground">
              {session.city}, {session.country}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            {new Date(session.openTime).toLocaleString()}
          </div>
        </div>
      </div>

      {!session.isCurrent && (
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-fit rounded-full py-2 -my-2 hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <MoreHorizontal/>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2 text-rose-600">
                      <X size={16} className="text-rose-600"/>
                      {t("settings.sessions.close.button")}
                    </div>
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("settings.sessions.close.title")}</DialogTitle>
                <DialogDescription>
                  {t("settings.sessions.close.description")}
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(session.id);
                    setOpen(false);
                  }}
                >
                  {t("settings.sessions.close.button")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
