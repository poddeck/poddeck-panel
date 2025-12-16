import {Navigate, Outlet, type RouteObject} from "react-router";
import {Component} from "./component";
import LoginAuthGuard from "@/routes/components/login-auth-guard.tsx";
import SimpleLayout from "@/layouts/simple";
import {Suspense} from "react";
import {LineLoading} from "@/components/loading";

const getRoutes = (): RouteObject[] => {
  return [
    {path: "cluster", element: Component("/pages/panel/cluster")},
    {path: "overview", element: Component("/pages/panel/overview")},
    {path: "nodes", element: Component("/pages/panel/nodes")},
    {path: "workload", element: Component("/pages/panel/workload")},
    {path: "namespaces", element: Component("/pages/panel/namespaces")},
    {path: "events", element: Component("/pages/panel/events")},
    {path: "pods", element: Component("/pages/panel/pods")},
    {path: "pod/overview", element: Component("/pages/panel/pod/overview")},
    {path: "pod/logs", element: Component("/pages/panel/pod/log")},
    {path: "pod/console", element: Component("/pages/panel/pod/console")},
    {path: "deployments", element: Component("/pages/panel/deployments")},
    {path: "deployment/overview", element: Component("/pages/panel/deployment/overview")},
    {path: "deployment/pods", element: Component("/pages/panel/deployment/pods")},
    {path: "deployment/edit", element: Component("/pages/panel/deployment/edit")},
    {path: "services", element: Component("/pages/panel/services")},
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
      element: <Navigate to="/cluster/" replace/>
    }, ...getRoutes()],
  },
];
