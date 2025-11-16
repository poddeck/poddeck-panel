import { Navigate, type RouteObject } from "react-router";
import { Component } from "./component";
import LoginAuthGuard from "@/routes/components/login-auth-guard.tsx";

const getRoutes = (): RouteObject[] => {
  const panelRoutes: RouteObject[] = [
    { path: "test", element: Component("/pages/panel/test") },
  ];
  return panelRoutes;
};

export const panelRoutes: RouteObject[] = [
  {
    element: (
      <LoginAuthGuard>
        <div />
      </LoginAuthGuard>
    ),
    children: [{ index: true, element: <Navigate to="/" replace /> }, ...getRoutes()],
  },
];
