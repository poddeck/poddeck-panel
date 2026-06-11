import type { StateStorage } from "zustand/middleware";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";

export const cookieStorage = (expiry: number): StateStorage => ({
  getItem: (name) => getCookie(name) ?? null,
  setItem: (name, value) => {
    setCookie(name, value, {
      expires: expiry,
      secure: true,
      path: "/",
      sameSite: "lax",
    });
  },
  removeItem: (name) => {
    removeCookie(name, { path: "/", sameSite: "lax" });
  },
});
