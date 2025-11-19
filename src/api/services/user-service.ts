import client from "../client";

export interface LoginRequest {
  email: string;
  password: string;
  multi_factor_code: string;
}

export type LoginResponse = {
  success: boolean;
  authentication_token?: string;
  refresh_token?: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export type RefreshResponse = {
  success: boolean;
  authentication_token?: string;
  refresh_token?: string;
}

export const UserApi = {
  Login: "/authentication/login/",
  Refresh: "/authentication/refresh/",
  Logout: "/authentication/logout/",
} as const;

const login = (data: LoginRequest) => client.post<LoginResponse>({
  url: UserApi.Login,
  data
});
const refresh = (data: RefreshRequest) => client.post<RefreshResponse>({
  url: UserApi.Refresh,
  data
});
const logout = () => client.get({url: UserApi.Logout});

export default {
  login,
  refresh,
  logout,
};