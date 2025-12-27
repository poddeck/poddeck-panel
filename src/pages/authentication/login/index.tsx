import type { LoginRequest } from "@/api/services/user-service"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent, CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { Navigate, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useLogin, useUserToken } from "@/store/user-store"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form.tsx";

export default function LoginForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const login = useLogin()
  const token = useUserToken()

  const form = useForm<LoginRequest>()
  const { setFocus, getValues } = form

  const [loading, setLoading] = useState(false)
  const [otpRequired, setOtpRequired] = useState(false)
  const [otp, setOtp] = useState("")
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [recoveryCode, setRecoveryCode] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  if (token.authentication_token) {
    return <Navigate to="/cluster/" replace />
  }

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("remembered_email")
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail)
      setRememberMe(true)
      setTimeout(() => setFocus("password"), 0)
    } else {
      setTimeout(() => setFocus("email"), 0)
    }
  }, [setFocus])

  const handleFinish = async (values: LoginRequest) => {
    setLoading(true)
    try {
      rememberMe
        ? localStorage.setItem("remembered_email", values.email)
        : localStorage.removeItem("remembered_email")

      const response = await login({
        ...values,
        multi_factor_code: "",
      })

      if (!response.success && response.error === 1001) {
        setOtpRequired(true)
      } else if (response.success) {
        navigate("/cluster/", { replace: true })
      } else {
        toast.error(t("authentication.login.failed"))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async () => {
    const { email, password } = getValues()
    if (!email || !password) return

    setLoading(true)
    try {
      const response = await login({
        email,
        password,
        multi_factor_code: otp,
      })

      setOtp("")
      response.success
        ? navigate("/cluster/", { replace: true })
        : toast.error(t("authentication.login.otp.failed"))
    } finally {
      setLoading(false)
    }
  }

  const handleRecoverySubmit = async () => {
    const { email, password } = getValues()
    if (!email || !password) return

    setLoading(true)
    try {
      const response = await login({
        email,
        password,
        multi_factor_code: recoveryCode,
      })

      response.success
        ? navigate("/cluster/", { replace: true })
        : toast.error(t("authentication.login.recovery.failed"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (otp.length === 6 && !loading) handleOtpSubmit()
  }, [otp])

  useEffect(() => {
    if (recoveryCode.length === 16 && !loading) handleRecoverySubmit()
  }, [recoveryCode])

  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-4">
      <span className="font-bold mb-5 text-3xl">PodDeck</span>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("authentication.login.title")}</CardTitle>
          <CardDescription>{t("authentication.login.description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFinish)}
            >
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
                        className="text-sm"
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

              <div className="flex items-center mb-10">
                <input
                  id="remember-check"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
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
        </CardContent>
      </Card>

      <Dialog open={otpRequired} onOpenChange={setOtpRequired}>
        <DialogContent className="bg-white/10 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>
              {t("authentication.login.otp.title")}
            </DialogTitle>
            <DialogDescription>
              {t("authentication.login.otp.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center my-4">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0, 1, 2].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
              <InputOTPGroup>
                {[3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <DialogFooter>
            <Button onClick={handleOtpSubmit} disabled={loading}>
              {t("authentication.login.otp.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={recoveryOpen} onOpenChange={setRecoveryOpen}>
        <DialogContent className="sm:max-w-[800px] bg-white/10 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>
              {t("authentication.login.recovery.title")}
            </DialogTitle>
            <DialogDescription>
              {t("authentication.login.recovery.description")}
            </DialogDescription>
          </DialogHeader>

          <InputOTP
            maxLength={16}
            value={recoveryCode}
            onChange={setRecoveryCode}
          >
            {[0, 4, 8, 12].map((start) => (
              <InputOTPGroup key={start}>
                {[0, 1, 2, 3].map((i) => (
                  <InputOTPSlot key={i} index={start + i} />
                ))}
              </InputOTPGroup>
            ))}
          </InputOTP>

          <DialogFooter>
            <Button
              onClick={handleRecoverySubmit}
              disabled={loading || recoveryCode.length !== 16}
            >
              {t("authentication.login.recovery.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
