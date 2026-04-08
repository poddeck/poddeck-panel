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
  agent_key: string;
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

export type ClusterAgentInstallRequest = {
  id: string;
}

export type ClusterAgentInstallResponse = {
  success: boolean;
  cluster_id: string;
  agent_key: string;
}

export const ClusterApi = {
  Create: "/cluster/create/",
  Edit: "/cluster/edit/",
  Delete: "/cluster/delete/",
  List: "/clusters/",
  AgentInstall: "/cluster/agent-install/",
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
const agentInstall = (data: ClusterAgentInstallRequest) => client.post<ClusterAgentInstallResponse>({
  url: ClusterApi.AgentInstall,
  data
});

export default {
  create,
  edit,
  remove,
  list,
  agentInstall,
};