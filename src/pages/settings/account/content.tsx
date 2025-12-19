import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SettingsService from "@/api/services/settings-service.ts";
import {useTranslation} from "react-i18next";
import {Spinner} from "@/components/ui/spinner.tsx";
import {toast} from "sonner";
import {useRouter} from "@/routes/hooks";
import {useUserActions} from "@/store/user-store.ts";

export default function AccountPageContent() {
  const {t} = useTranslation();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { clearUserToken, clearUserInformation } = useUserActions();
  const { replace } = useRouter();

  const handleDelete = async () => {
    if (!password) return;

    try {
      setLoading(true);
      const response = await SettingsService.deleteAccount({ password });

      if (response.success) {
        clearUserToken();
        clearUserInformation();
        replace("/login/");
      } else {
        toast.error(t("settings.account.delete.wrong.password"), {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 w-full border-b border-secondary pb-2">
          <span className="text-destructive">{t("settings.account.delete.title")}</span>
        </div>

        <div className="mb-6">
          <span className="text-sm text-muted-foreground">
            {t("settings.account.delete.description")}
          </span>
        </div>

        <div className="flex justify-center">
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-1 size-4" />
                {t("settings.account.delete.button")}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("settings.account.delete.dialog.title")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("settings.account.delete.dialog.description")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-2">
                <Label htmlFor="password">{t("settings.account.delete.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("settings.account.delete.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>
                  {t("settings.account.delete.cancel")}
                </AlertDialogCancel>

                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading && <Spinner className="mr-1" />}
                  {t("settings.account.delete.button")}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
