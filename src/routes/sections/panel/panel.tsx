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
    {path: "node/overview", element: Component("/pages/panel/node/overview")},
    {path: "node/workload", element: Component("/pages/panel/node/workload")},
    {path: "node/pods", element: Component("/pages/panel/node/pods")},
    {path: "workload", element: Component("/pages/panel/workload")},
    {path: "namespaces", element: Component("/pages/panel/namespaces")},
    {path: "events", element: Component("/pages/panel/events")},
    {path: "apps", element: Component("/pages/panel/apps")},
    {path: "pods", element: Component("/pages/panel/pods")},
    {path: "pod/overview", element: Component("/pages/panel/pod/overview")},
    {path: "pod/logs", element: Component("/pages/panel/pod/log")},
    {path: "pod/console", element: Component("/pages/panel/pod/console")},
    {path: "deployments", element: Component("/pages/panel/deployments")},
    {path: "deployment/overview", element: Component("/pages/panel/deployment/overview")},
    {path: "deployment/pods", element: Component("/pages/panel/deployment/pods")},
    {path: "deployment/edit", element: Component("/pages/panel/deployment/edit")},
    {path: "daemon-sets", element: Component("/pages/panel/daemon-sets")},
    {path: "daemon-set/overview", element: Component("/pages/panel/daemon-set/overview")},
    {path: "daemon-set/pods", element: Component("/pages/panel/daemon-set/pods")},
    {path: "daemon-set/edit", element: Component("/pages/panel/daemon-set/edit")},
    {path: "replica-sets", element: Component("/pages/panel/replica-sets")},
    {path: "replica-set/overview", element: Component("/pages/panel/replica-set/overview")},
    {path: "replica-set/pods", element: Component("/pages/panel/replica-set/pods")},
    {path: "replica-set/edit", element: Component("/pages/panel/replica-set/edit")},
    {path: "stateful-sets", element: Component("/pages/panel/stateful-sets")},
    {path: "stateful-set/overview", element: Component("/pages/panel/stateful-set/overview")},
    {path: "stateful-set/pods", element: Component("/pages/panel/stateful-set/pods")},
    {path: "stateful-set/edit", element: Component("/pages/panel/stateful-set/edit")},
    {path: "cron-jobs", element: Component("/pages/panel/cron-jobs")},
    {path: "cron-job/overview", element: Component("/pages/panel/cron-job/overview")},
    {path: "cron-job/edit", element: Component("/pages/panel/cron-job/edit")},
    {path: "services", element: Component("/pages/panel/services")},
    {path: "audits", element: Component("/pages/panel/audits")},
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
