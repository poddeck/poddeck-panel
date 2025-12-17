import * as React from "react";
import { Button } from "@/components/ui/button";
import { ShieldPlus, ShieldOff } from "lucide-react";
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
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {toast} from "sonner";

type Step = "password" | "qr" | "recovery" | "confirm" | "deactivate";

export default function SecurityPageContent() {
  const [enabled, setEnabled] = React.useState<boolean | null>(null);
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>("password");
  const [loading, setLoading] = React.useState(false);

  const [password, setPassword] = React.useState("");
  const [qrCode, setQrCode] = React.useState<string>("");
  const [secret, setSecret] = React.useState<string>("");
  const [recoveryCodes, setRecoveryCodes] = React.useState<string[]>([]);
  const [token, setToken] = React.useState("");

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
        toast.error("Wrong password", {
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
        toast.success("Successful", {
          position: "top-right",
        });
      } else {
        toast.error("Wrong code", {
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
        toast.success("Successful", {
          position: "top-right",
        });
      } else {
        toast.error("Wrong password", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (enabled === null) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="mb-4 border-b pb-2">
          Two-factor authentication
        </div>

        <p className="mb-6 text-sm text-muted-foreground">
          With two-factor authentication, you can protect your account against
          unauthorized access.
        </p>

        <div className="flex justify-center gap-4">
          {!enabled && (
            <Button onClick={() => setOpen(true)}>
              <ShieldPlus className="mr-2 size-4" />
              Activate
            </Button>
          )}

          {enabled && (
            <Button
              variant="destructive"
              onClick={deactivateTwoFactor}
            >
              <ShieldOff className="mr-2 size-4" />
              Deactivate
            </Button>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          {step === "password" && (
            <>
              <DialogHeader>
                <DialogTitle>Confirm your password</DialogTitle>
                <DialogDescription>
                  Enter your password to begin two-factor authentication setup.
                </DialogDescription>
              </DialogHeader>

              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <DialogFooter>
                <Button
                  onClick={startSetup}
                  disabled={!password || loading}
                >
                  Continue
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "qr" && (
            <>
              <DialogHeader>
                <DialogTitle>Scan QR code</DialogTitle>
                <DialogDescription>
                  Add your account to an authenticator app.
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
                  Download an authenticator app (Google Authenticator,
                  Microsoft Authenticator, etc.)
                </li>
                <li>
                  Scan the QR code or manually enter the secret key above.
                </li>
              </ol>

              <DialogFooter>
                <Button onClick={() => setStep("recovery")}>
                  I’ve scanned the QR code
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "recovery" && (
            <>
              <DialogHeader>
                <DialogTitle>Save recovery codes</DialogTitle>
                <DialogDescription>
                  These codes are required if you lose access to your
                  authenticator device.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-2 rounded-lg border p-3 font-mono text-sm">
                {recoveryCodes.map((code) => (
                  <div key={code}>{code}</div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground">
                Store these codes in a safe place. Do not keep them on the same
                device you use for two-factor authentication.
              </p>

              <DialogFooter>
                <Button onClick={() => setStep("confirm")}>
                  I have saved my codes
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "confirm" && (
            <>
              <DialogHeader>
                <DialogTitle>Confirm setup</DialogTitle>
                <DialogDescription>
                  Enter the 6-digit code from your authenticator app.
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-center items-center my-3">
                <InputOTP maxLength={6} onChange={setToken} value={token}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
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
                  Enable two-factor authentication
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "deactivate" && (
            <>
              <DialogHeader>
                <DialogTitle>Deactivate 2FA</DialogTitle>
                <DialogDescription>
                  Enter your password to deactivate two-factor authentication.
                </DialogDescription>
              </DialogHeader>

              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Password"
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
                  Deactivate
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
