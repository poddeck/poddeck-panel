import client from "../client";

import type { UserToken } from "@/store/user-store";

export interface LoginRequest {
  username: string;
  password: string;
}

export type LoginResponse = UserToken;

export const UserApi = {
  Login: "/authentication/login",
  Refresh: "/authentication/refresh",
  Logout: "/authentication/logout",
} as const;

const login = (data: LoginRequest) => client.post<LoginResponse>({ url: UserApi.Login, data });
const logout = () => client.get({ url: UserApi.Logout });

export default {
  login,
  logout,
};