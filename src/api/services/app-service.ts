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

export const AppApi = {
  List: "/apps/",
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

export default {
  list,
  listCluster
};