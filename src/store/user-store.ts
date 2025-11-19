import {useMutation} from "@tanstack/react-query";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import userService, {type LoginRequest} from "@/api/services/user-service";
import cookiesStorage from "@/store/cookie-store.ts";
import type {AxiosError} from "axios";
import {toast} from "sonner";
import {useTranslation} from "react-i18next";
import {useRouter} from "@/routes/hooks";

export interface UserToken {
  authentication_token?: string;
  refresh_token?: string;
}

type UserStore = {
  token: UserToken;

  actions: {
    setUserToken: (token: UserToken) => void;
    clearUserToken: () => void;
  };
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      token: {},
      actions: {
        setUserToken: (token) => {
          set({token});
        },
        clearUserToken() {
          set({token: {}});
        },
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => cookiesStorage),
      partialize: (state) => ({
        ["token"]: state.token,
      }),
    },
  ),
);

export const useUserToken = () => useUserStore((state) => state.token);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useLogin = () => {
  const {t} = useTranslation();

  const {setUserToken} = useUserActions();

  const loginMutation = useMutation({
    mutationFn: userService.login,
  });

  return async (data: LoginRequest) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      const {authentication_token, refresh_token} = response;
      setUserToken({authentication_token, refresh_token});
      toast.success(t("authentication.login.successful"), {
        position: "top-right",
      });
    } catch (error) {
      if (error != null && (error as AxiosError).status === 401) {
        toast.error(t("authentication.login.failed"));
      }
      throw error;
    }
  };
};

export const useLogout = () => {
  const {clearUserToken} = useUserActions();
  const {replace} = useRouter();

  const logoutMutation = useMutation({
    mutationFn: userService.logout,
  });

  return async () => {
    await logoutMutation.mutateAsync();
    try {
      clearUserToken();
      replace("/login/");
    } catch (error) {
      console.log(error);
    } finally {
      replace("/login/");
    }
  };
};

export default useUserStore;