import client from "../client";

export type Cluster = {
  id: string;
  name: string;
  icon: string;
  created_at: number;
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

export interface ClusterEditRequest {
  id: string;
  name: string;
  icon: string;
}

export type ClusterEditResponse = {
  success: boolean;
}

export interface ClusterDeleteRequest {
  id: string;
}

export type ClusterDeleteResponse = {
  success: boolean;
}

export type ClusterListResponse = {
  clusters: Cluster[];
}

export const ClusterApi = {
  Create: "/cluster/create/",
  Edit: "/cluster/edit/",
  Delete: "/cluster/delete/",
  List: "/clusters/",
} as const;

const create = (data: ClusterCreateRequest) => client.post<ClusterCreateResponse>({
  url: ClusterApi.Create,
  data
});
const edit = (data: ClusterEditRequest) => client.post<ClusterEditResponse>({
  url: ClusterApi.Edit,
  data
});
const remove = (data: ClusterDeleteRequest) => client.post<ClusterDeleteResponse>({
  url: ClusterApi.Delete,
  data
});
const list = () => client.get<ClusterListResponse>({url: ClusterApi.List});

export default {
  create,
  edit,
  remove,
  list,
};