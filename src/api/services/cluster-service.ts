import client from "../client";

export type Cluster = {
  id: string;
  name: string;
}

export interface ClusterCreateRequest {
  name: string;
}

export type ClusterCreateResponse = {
  success: boolean;
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