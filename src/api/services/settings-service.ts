import client from "../client";

export interface UsernameResponse {
  username: string;
}

export interface ChangeUsernameRequest {
  username: string;
}

export interface AccountDeleteRequest {
  password: string;
}

export interface AccountDeleteResponse {
  success: boolean;
  error?: number;
}

export interface TwoFactorStatusResponse {
  enabled: boolean;
}

export interface TwoFactorSwitchRequest {
  password: string;
}

export interface TwoFactorSwitchResponse {
  success?: boolean;
  qrCode?: string;
  secret?: string;
  recoveryCodes?: string[];
}

export interface TwoFactorConfirmRequest {
  code: string;
}

export interface TwoFactorConfirmResponse {
  success: boolean;
}

export interface TwoFactorConfirmationCheckResponse {
  success: boolean;
  confirmed?: boolean;
}

export interface SessionInfo {
  id: string;
  platform: string;
  country: string;
  city: string;
  openTime: string;
  status: string;
  isCurrent: boolean;
}

export interface SessionListResponse {
  sessions: SessionInfo[];
}

export interface SessionCloseRequest {
  session: string;
}

export const SettingsApi = {
  ProfileUsername: "/settings/profile/username/",
  ProfileUsernameChange: "/settings/profile/username/change/",
  AccountDelete: "/settings/account/delete/",
  TwoFactorStatus: "/settings/2fa/",
  TwoFactorSwitch: "/settings/2fa/switch/",
  TwoFactorConfirm: "/settings/2fa/confirm/",
  TwoFactorConfirmationCheck: "/settings/2fa/confirmation/check/",
  SessionsList: "/settings/sessions/",
  SessionClose: "/settings/session/close/",
} as const;

const getUsername = () =>
  client.get<UsernameResponse>({
    url: SettingsApi.ProfileUsername,
  });

const changeUsername = (data: ChangeUsernameRequest) =>
  client.post<void>({
    url: SettingsApi.ProfileUsernameChange,
    data,
  });

const deleteAccount = (data: AccountDeleteRequest) =>
  client.post<AccountDeleteResponse>({
    url: SettingsApi.AccountDelete,
    data,
  });

const getTwoFactorStatus = () =>
  client.get<TwoFactorStatusResponse>({
    url: SettingsApi.TwoFactorStatus,
  });

const switchTwoFactor = (data: TwoFactorSwitchRequest) =>
  client.post<TwoFactorSwitchResponse>({
    url: SettingsApi.TwoFactorSwitch,
    data,
  });

const confirmTwoFactor = (data: TwoFactorConfirmRequest) =>
  client.post<TwoFactorConfirmResponse>({
    url: SettingsApi.TwoFactorConfirm,
    data,
  });

const checkTwoFactorConfirmation = () =>
  client.get<TwoFactorConfirmationCheckResponse>({
    url: SettingsApi.TwoFactorConfirmationCheck,
  });

const listSessions = () =>
  client.get<SessionListResponse>({
    url: SettingsApi.SessionsList,
  });

const closeSession = (data: SessionCloseRequest) =>
  client.post<void>({
    url: SettingsApi.SessionClose,
    data,
  });

export default {
  getUsername,
  changeUsername,
  deleteAccount,
  getTwoFactorStatus,
  switchTwoFactor,
  confirmTwoFactor,
  checkTwoFactorConfirmation,
  listSessions,
  closeSession,
};
