import client from "../client";

export type Cluster = {
  id: string;
  name: string;
  icon: string;
  online: boolean;
}

export interface ClusterCreateRequest {
  name: string;
  icon: string;
}

export type ClusterCreateResponse = {
  success: boolean;
  cluster: string;
}

export type ClusterListResponse = {
  clusters: Cluster[];
}

export const ClusterApi = {
  Create: "/cluster/create/",
  List: "/clusters/",
} as const;

const create = (data: ClusterCreateRequest) => client.post<ClusterCreateResponse>({
  url: ClusterApi.Create,
  data
});
const list = () => client.get<ClusterListResponse>({url: ClusterApi.List});

export default {
  create,
  list,
};