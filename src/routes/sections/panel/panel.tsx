import {Navigate, Outlet, type RouteObject} from "react-router";
import {Component} from "./component";
import LoginAuthGuard from "@/routes/components/login-auth-guard.tsx";
import SimpleLayout from "@/layouts/simple";
import {Suspense} from "react";
import {LineLoading} from "@/components/loading";

const getRoutes = (): RouteObject[] => {
  return [
    {path: "overview", element: Component("/pages/panel/overview")},
    {path: "nodes", element: Component("/pages/panel/nodes")},
    {path: "workload", element: Component("/pages/panel/workload")},
    {path: "namespaces", element: Component("/pages/panel/namespaces")},
    {path: "events", element: Component("/pages/panel/events")},
    {path: "pods", element: Component("/pages/panel/pods")},
    {path: "pod/overview", element: Component("/pages/panel/pod/overview")},
    {path: "pod/logs", element: Component("/pages/panel/pod/log")},
    {path: "pod/console", element: Component("/pages/panel/pod/console")},
    {path: "pod/events", element: Component("/pages/panel/pod/events")},
    {path: "pod/containers", element: Component("/pages/panel/pod/containers")},
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
