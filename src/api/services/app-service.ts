import client from "../client";

export type App = {
  repository: string;
  name: string;
  versions: Version[];
  description: string;
  keywords: string[];
  installed: boolean;
}

export type Version = {
  chart_version: string;
  app_version: string;
}

export type AppListResponse = {
  apps: App[];
  success?: boolean;
}

export interface AppInstallRequest {
  name: string;
  chart: string;
  namespace: string;
  version: string;
}

export type AppInstallResponse = {
  success: boolean;
  status: string;
  output: string;
}

export const AppApi = {
  List: "/apps/",
  Install: "/app/install/",
} as const;

const list = () => client.get<AppListResponse>({url: AppApi.List});
const listCluster = (clusterId: string) => client.get<AppListResponse>(
  {
    url: AppApi.List,
    headers: {
      Cluster: clusterId,
    },
  }
);
const install = (data: AppInstallRequest) => client.post<AppInstallResponse>({
  url: AppApi.Install,
  data
});

export default {
  list,
  listCluster,
  install
};