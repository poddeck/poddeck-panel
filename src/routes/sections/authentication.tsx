import {lazy} from "react";
import type {RouteObject} from "react-router";

const LoginPage = lazy(() => import("@/pages/authentication/login"));
export const authenticationRoutes: RouteObject[] = [
  {
    path: "login",
    element: <LoginPage/>,
  },
];