import type {LoginRequest} from "@/api/services/user-service";
import Logo from "@/assets/logo.webp";
import {Spinner} from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {Navigate, useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import './index.css';
import {useLogin, useUserToken} from "@/store/user-store.ts";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {toast} from "sonner";
import {Button} from "@/components/ui/button.tsx";

export default function LoginForm() {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const login = useLogin();
  const form = useForm<LoginRequest>({});
  const token = useUserToken();

  if (token.authentication_token) {
    return <Navigate to="/cluster/" replace />;
  }

  const handleFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const payload: LoginRequest = {...values, multi_factor_code: ""};
      const response = await login(payload);

      if (!response.success && response.error === 1001) {
        setOtpRequired(true);
      } else if (response.success) {
        navigate("/cluster/", {replace: true});
      } else {
        toast.error(t("authentication.login.failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!form.getValues().email || !form.getValues().password) return;

    setLoading(true);
    try {
      const payload: LoginRequest = {
        email: form.getValues().email,
        password: form.getValues().password,
        multi_factor_code: otp
      };
      const response = await login(payload);

      setOtp("");
      if (response.success) {
        setOtpRequired(false);
        navigate("/cluster/", {replace: true});
      } else {
        toast.error("Wrong code", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6 && !loading) {
      handleOtpSubmit();
    }
  }, [otp]);

  return (
    <div
      id="login-container"
      className="min-h-screen w-full relative overflow-hidden text-white"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFinish)}
            className="relative w-[min(500px,90%)] max-w-md p-12 text-center rounded-3xl border border-white/20 bg-[#0d1117]/40 backdrop-blur-2xl"
          >
            <img
              src={Logo}
              alt="Logo"
              className="mx-auto mb-12 w-24 h-auto transition-transform duration-300 hover:scale-110 rounded-lg"
            />

            <FormField
              control={form.control}
              name="email"
              rules={{required: t("authentication.login.email.missing")}}
              render={({field}) => (
                <FormItem className="mb-5">
                  <FormLabel>{t("authentication.login.email")}</FormLabel>
                  <FormControl>
                    <input
                      id="email"
                      placeholder={t("authentication.login.email")}
                      className="w-full px-4 py-2 rounded bg-transparent border border-gray-600 placeholder-gray-400 focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              rules={{required: t("authentication.login.password.missing")}}
              render={({field}) => (
                <FormItem className="mb-5">
                  <div className="flex items-center justify-between">
                    <FormLabel>{t("authentication.login.password")}</FormLabel>
                    <a
                      id="forgot-password"
                      href="/password/reset/request/"
                      className="text-sm underline text-blue-400"
                    >
                      {t("authentication.login.password.forgot")}
                    </a>
                  </div>
                  <FormControl>
                    <input
                      id="password"
                      type="password"
                      placeholder={t("authentication.login.password")}
                      className="w-full px-4 py-2 rounded bg-transparent border border-gray-600 placeholder-gray-400 focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center mb-15">
              <input
                id="remember-check"
                type="checkbox"
                className="h-4 w-4 mr-3 border border-gray-600 rounded-sm bg-transparent checked:bg-blue-600"
              />
              <label htmlFor="remember-check" className="select-none">
                {t("authentication.login.remember")}
              </label>
            </div>

            <button
              type="submit"
              id="login"
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition inline-flex items-center justify-center"
            >
              {t("authentication.login.submit")}
              {loading && <Spinner className="ml-3" />}
            </button>
          </form>
        </Form>
      </div>

      <Dialog open={otpRequired} onOpenChange={setOtpRequired}>
        <DialogContent className="bg-white/10 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>{t("authentication.login.otp.title")}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center my-4">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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
            <Button onClick={handleOtpSubmit} disabled={loading}>
              {t("authentication.login.otp.submit")} {loading && <Spinner />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
