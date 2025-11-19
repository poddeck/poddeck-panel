import {Navigate, Outlet, type RouteObject} from "react-router";
import {Component} from "./component";
import LoginAuthGuard from "@/routes/components/login-auth-guard.tsx";
import SimpleLayout from "@/layouts/simple";
import {Suspense} from "react";
import {LineLoading} from "@/components/loading";

const getRoutes = (): RouteObject[] => {
  return [
    {path: "overview", element: Component("/pages/panel/overview")},
  ];
};

export const panelRoutes: RouteObject[] = [
  {
    element: (
      <LoginAuthGuard>
        <SimpleLayout>
          <Suspense fallback={<LineLoading/>}>
            <Outlet/>
          </Suspense>
        </SimpleLayout>
      </LoginAuthGuard>
    ),
    children: [{
      index: true,
      element: <Navigate to="/overview/" replace/>
    }, ...getRoutes()],
  },
];
