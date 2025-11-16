import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import userService, { type LoginRequest } from "@/api/services/user-service";

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
}

type UserStore = {
  userToken: UserToken;

  actions: {
    setUserToken: (token: UserToken) => void;
    clearUserToken: () => void;
  };
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: {},
      userToken: {},
      actions: {
        setUserToken: (userToken) => {
          set({ userToken });
        },
        clearUserToken() {
          set({ userToken: {} });
        },
      },
    }),
    {
      name: "userStore", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        ["userToken"]: state.userToken,
      }),
    },
  ),
);

export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useLogin = () => {
  const { setUserToken } = useUserActions();

  const loginMutation = useMutation({
    mutationFn: userService.login,
  });

  const login = async (data: LoginRequest) => {
    const res = await loginMutation.mutateAsync(data);
    const { accessToken, refreshToken } = res;
    setUserToken({ accessToken, refreshToken });
  };

  return login;
};

export default useUserStore;