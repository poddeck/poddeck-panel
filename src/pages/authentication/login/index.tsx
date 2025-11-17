import type {LoginRequest} from "@/api/services/user-service";
import Logo from "@/assets/logo.webp"
import Spinner from "@/ui/spinner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router";
import './index.css';
import {useLogin} from "@/store/user-store.ts";

export default function LoginForm() {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = useLogin();

  const form = useForm<LoginRequest>({});

  const handleFinish = async (values: LoginRequest) => {
    const payload: LoginRequest = {
      ...values,
      multi_factor_code: "",
    };
    console.log(payload);
    setLoading(true);
    try {
      await login(payload);
      navigate("/", {replace: true});
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      id="login-container"
      className="min-h-screen w-full relative overflow-hidden text-white"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFinish)}
            className="relative w-[min(500px,90%)] max-w-md text-center p-12 rounded-2xl border border-[#373b41] bg-[#0d1117]/60"
          >
            <img
              src={Logo}
              alt="Logo"
              className="mx-auto mb-12 w-24 h-auto transition-transform duration-300 hover:scale-110 rounded-lg"
            />

            <FormField
              control={form.control}
              name="email"
              rules={{ required: t("authentication.login.email.missing") }}
              render={({ field }) => (
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
              rules={{ required: t("authentication.login.password.missing") }}
              render={({ field }) => (
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
              {loading && <Spinner className="ml-3"></Spinner>}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}