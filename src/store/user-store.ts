import {useMemo} from "react";
import {useMutation} from "@tanstack/react-query";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import userService, {type LoginRequest} from "@/api/services/user-service";
import {cookieStorage} from "@/store/cookie-store.ts";
import {toast} from "sonner";
import {useTranslation} from "react-i18next";
import {useRouter} from "@/routes/hooks";

const AUTH_COOKIE_EXPIRY = 1;
const REFRESH_COOKIE_EXPIRY = 30;

export interface UserToken {
  authentication_token?: string;
  refresh_token?: string;
}

export interface UserInformation {
  email?: string;
  name?: string;
}

type AuthStore = {
  authentication_token?: string;
  information: UserInformation;
  actions: {
    setAuthenticationToken: (token?: string) => void;
    clearAuthenticationToken: () => void;
    setInformation: (info: UserInformation) => void;
    clearInformation: () => void;
  };
};

type RefreshStore = {
  refresh_token?: string;
  actions: {
    setRefreshToken: (token?: string) => void;
    clearRefreshToken: () => void;
  };
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      authentication_token: undefined,
      information: {},
      actions: {
        setAuthenticationToken: (token) => set({authentication_token: token}),
        clearAuthenticationToken: () => set({authentication_token: undefined}),
        setInformation: (info) => set({information: info}),
        clearInformation: () => set({information: {}}),
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => cookieStorage(AUTH_COOKIE_EXPIRY)),
      partialize: (s) => ({
        authentication_token: s.authentication_token,
        information: s.information,
      }),
    },
  ),
);

const useRefreshStore = create<RefreshStore>()(
  persist(
    (set) => ({
      refresh_token: undefined,
      actions: {
        setRefreshToken: (token) => set({refresh_token: token}),
        clearRefreshToken: () => set({refresh_token: undefined}),
      },
    }),
    {
      name: "user-refresh",
      storage: createJSONStorage(() => cookieStorage(REFRESH_COOKIE_EXPIRY)),
      partialize: (s) => ({refresh_token: s.refresh_token}),
    },
  ),
);

export const useUserToken = (): UserToken => {
  const authentication_token = useAuthStore((s) => s.authentication_token);
  const refresh_token = useRefreshStore((s) => s.refresh_token);
  return {authentication_token, refresh_token};
};

export const useUserInformation = () => useAuthStore((s) => s.information);

export const useUserActions = () => {
  const authActions = useAuthStore((s) => s.actions);
  const refreshActions = useRefreshStore((s) => s.actions);
  return useMemo(
    () => ({
      setUserToken: (token: UserToken) => {
        authActions.setAuthenticationToken(token.authentication_token);
        refreshActions.setRefreshToken(token.refresh_token);
      },
      clearUserToken: () => {
        authActions.clearAuthenticationToken();
        refreshActions.clearRefreshToken();
      },
      setUserInformation: authActions.setInformation,
      clearUserInformation: authActions.clearInformation,
    }),
    [authActions, refreshActions],
  );
};

export const useHasUserHydrated = () => {
  const auth = useAuthStore.persist.hasHydrated();
  const refresh = useRefreshStore.persist.hasHydrated();
  return auth && refresh;
};

const userStore = {
  getState: () => {
    const auth = useAuthStore.getState();
    const refresh = useRefreshStore.getState();
    return {
      token: {
        authentication_token: auth.authentication_token,
        refresh_token: refresh.refresh_token,
      } as UserToken,
      information: auth.information,
      actions: {
        setUserToken: (token: UserToken) => {
          auth.actions.setAuthenticationToken(token.authentication_token);
          refresh.actions.setRefreshToken(token.refresh_token);
        },
        clearUserToken: () => {
          auth.actions.clearAuthenticationToken();
          refresh.actions.clearRefreshToken();
        },
      },
    };
  },
};

export const useLogin = () => {
  const { t } = useTranslation();

  const { setUserToken, setUserInformation } = useUserActions();

  const loginMutation = useMutation({
    mutationFn: userService.login,
  });

  return async (data: LoginRequest) => {
    const response = await loginMutation.mutateAsync(data);
    if (!response.success) {
      return response
    }
    const { authentication_token, refresh_token, email, name } = response;

    setUserToken({ authentication_token, refresh_token });
    setUserInformation({ email, name });

    toast.success(t("authentication.login.successful"), {
      position: "top-right",
    });
    return response;
  };
};

export const useLogout = () => {
  const { clearUserToken, clearUserInformation } = useUserActions();
  const { replace } = useRouter();

  const logoutMutation = useMutation({
    mutationFn: userService.logout,
  });

  return async () => {
    await logoutMutation.mutateAsync();
    try {
      clearUserToken();
      clearUserInformation();
      replace("/login/");
    } catch (error) {
      console.log(error);
    } finally {
      replace("/login/");
    }
  };
};

export default userStore;
