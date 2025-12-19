import * as React from "react";
import { Button } from "@/components/ui/button";
import {ShieldPlus, ShieldOff, Copy, Check} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SettingsService from "@/api/services/settings-service.ts";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {toast} from "sonner";
import {useTranslation} from "react-i18next";

type Step = "password" | "qr" | "recovery" | "confirm" | "deactivate";

export default function SecurityPageContent() {
  const {t} = useTranslation();
  const [enabled, setEnabled] = React.useState<boolean | null>(null);
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>("password");
  const [loading, setLoading] = React.useState(false);

  const [password, setPassword] = React.useState("");
  const [qrCode, setQrCode] = React.useState<string>("");
  const [secret, setSecret] = React.useState<string>("");
  const [recoveryCodes, setRecoveryCodes] = React.useState<string[]>([]);
  const [token, setToken] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    SettingsService.getTwoFactorStatus().then((response) =>
      setEnabled(response.enabled)
    );
  }, []);

  const startSetup = async () => {
    setLoading(true);
    try {
      const response = await SettingsService.switchTwoFactor({ password });
      if (response.success) {
        setQrCode(response.qrCode!);
        setSecret(response.secret!);
        setRecoveryCodes(response.recoveryCodes || []);
        setStep("qr");
      } else {
        toast.error(t("settings.security.2fa.wrong.password"), {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmSetup = async () => {
    setLoading(true);
    try {
      const response = await SettingsService.confirmTwoFactor({ code: token });
      if (response.success) {
        setEnabled(true);
        setOpen(false);
        setStep("password");
        setToken("");
        toast.success(t("settings.security.2fa.activation.successful"), {
          position: "top-right",
        });
      } else {
        toast.error(t("settings.security.2fa.wrong.code"), {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const deactivateTwoFactor = async () => {
    setStep("deactivate");
    setOpen(true);
  };

  const confirmDeactivation = async () => {
    if (!password) return;

    setLoading(true);
    try {
      const response = await SettingsService.switchTwoFactor({ password });
      if (response.success) {
        setEnabled(false);
        setOpen(false);
        setStep("password");
        setPassword("");
        toast.success(t("settings.security.2fa.deactivation.successful"), {
          position: "top-right",
        });
      } else {
        toast.error(t("settings.security.2fa.wrong.password"), {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRecoveryCodes = async () => {
    await navigator.clipboard.writeText(recoveryCodes.join("\n"));
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (enabled === null) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="mb-4 border-b pb-2">
          {t("settings.security.2fa.title")}
        </div>

        <p className="mb-6 text-sm text-muted-foreground">
          {t("settings.security.2fa.description")}
        </p>

        <div className="flex justify-center gap-4">
          {!enabled && (
            <Button onClick={() => setOpen(true)}>
              <ShieldPlus className="mr-1 size-4" />
              {t("settings.security.2fa.activate")}
            </Button>
          )}

          {enabled && (
            <Button
              variant="destructive"
              onClick={deactivateTwoFactor}
            >
              <ShieldOff className="mr-1 size-4" />
              {t("settings.security.2fa.deactivate")}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          {step === "password" && (
            <>
              <DialogHeader>
                <DialogTitle>{t("settings.security.2fa.password.title")}</DialogTitle>
                <DialogDescription>
                  {t("settings.security.2fa.password.description")}
                </DialogDescription>
              </DialogHeader>

              <Label>{t("settings.security.2fa.password.label")}</Label>
              <Input
                type="password"
                placeholder={t("settings.security.2fa.password.label")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <DialogFooter>
                <Button
                  onClick={startSetup}
                  disabled={!password || loading}
                >
                  {t("settings.security.2fa.continue")}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "qr" && (
            <>
              <DialogHeader>
                <DialogTitle>{t("settings.security.2fa.qr.title")}</DialogTitle>
                <DialogDescription>
                  {t("settings.security.2fa.qr.description")}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center gap-4">
                <img
                  src={`data:image/png;base64,${qrCode}`}
                  alt="QR Code"
                  className="h-48 w-48 rounded-xl"
                />
                <code className="rounded bg-muted px-3 py-1 text-sm">
                  {secret}
                </code>
              </div>

              <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                <li>
                  {t("settings.security.2fa.qr.instructions.1")}
                </li>
                <li>
                  {t("settings.security.2fa.qr.instructions.2")}
                </li>
              </ol>

              <DialogFooter>
                <Button onClick={() => setStep("recovery")}>
                  {t("settings.security.2fa.continue")}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "recovery" && (
            <>
              <DialogHeader>
                <DialogTitle>{t("settings.security.2fa.recovery.title")}</DialogTitle>
                <DialogDescription>
                  {t("settings.security.2fa.recovery.description")}
                </DialogDescription>
              </DialogHeader>

              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className={`absolute right-2 top-2`}
                  onClick={handleCopyRecoveryCodes}
                >
                  {copied
                    ? <Check className="mr-1 h-4 w-4" />
                    : <Copy className="mr-1 h-4 w-4" />}
                  {copied
                    ? t("settings.security.2fa.recovery.copied")
                    : t("settings.security.2fa.recovery.copy")}
                </Button>

                <div className="grid grid-cols-2 gap-2 rounded-lg border px-3 py-15 font-mono text-sm text-center">
                  {recoveryCodes.map((code) => (
                    <div key={code}>{code}</div>
                  ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {t("settings.security.2fa.recovery.instructions")}
              </p>

              <DialogFooter>
                <Button onClick={() => setStep("confirm")}>
                  {t("settings.security.2fa.continue")}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "confirm" && (
            <>
              <DialogHeader>
                <DialogTitle>{t("settings.security.2fa.confirmation.title")}</DialogTitle>
                <DialogDescription>
                  {t("settings.security.2fa.confirmation.description")}
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-center items-center my-3">
                <InputOTP maxLength={6} onChange={setToken} value={token}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <DialogFooter>
                <Button
                  onClick={confirmSetup}
                  disabled={token.length !== 6 || loading}
                >
                  {t("settings.security.2fa.continue")}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "deactivate" && (
            <>
              <DialogHeader>
                <DialogTitle>{t("settings.security.2fa.deactivation.title")}</DialogTitle>
                <DialogDescription>
                  {t("settings.security.2fa.deactivation.description")}
                </DialogDescription>
              </DialogHeader>

              <Label>{t("settings.security.2fa.password.label")}</Label>
              <Input
                type="password"
                placeholder={t("settings.security.2fa.password.label")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <DialogFooter className="justify-between">
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeactivation}
                  disabled={!password || loading}
                >
                  {t("settings.security.2fa.deactivate")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
