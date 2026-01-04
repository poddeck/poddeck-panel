import client from "../client";

export type ReplicaSet = {
  name: string;
  namespace: string;
  replicas: number;
  fully_labeled_replicas: number;
  ready_replicas: number;
  available_replicas: number;
  observed_generation: number;
  age: number;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  container_name: string;
  container_image: string;
  container_cpu_limit: number;
  container_cpu_request: number;
  container_memory_limit: number;
  container_memory_request: number;
  conditions: Condition[];
  events: Event[];
  raw: string;
}

export type Condition = {
  type: string;
  status: string;
  reason: string;
  message: string;
  last_transition: number;
}

export type Event = {
  type: string;
  reason: string;
  message: string;
  timestamp: number;
  source: string;
}

export type ReplicaSetListResponse = {
  replica_sets: ReplicaSet[];
  success?: boolean;
}

export interface ReplicaSetFindRequest {
  namespace: string;
  replica_set: string;
}

export type ReplicaSetFindResponse = {
  success: boolean;
  replica_set: ReplicaSet;
}

export interface ReplicaSetCreateRequest {
  raw: string;
}

export type ReplicaSetCreateResponse = {
  success: boolean;
  namespace: string;
  replica_set: string;
}

export interface ReplicaSetDeleteRequest {
  namespace: string;
  replica_set: string;
}

export type ReplicaSetDeleteResponse = {
  success: boolean;
}

export interface ReplicaSetScaleRequest {
  namespace: string;
  replica_set: string;
  replicas: number;
}

export type ReplicaSetScaleResponse = {
  success: boolean;
}

export interface ReplicaSetEditRequest {
  namespace: string;
  replica_set: string;
  raw: string;
}

export type ReplicaSetEditResponse = {
  success: boolean;
}

export const ReplicaSetApi = {
  List: "/replica-sets/",
  Find: "/replica-set/find/",
  Create: "/replica-set/create/",
  Delete: "/replica-set/delete/",
  Scale: "/replica-set/scale/",
  Edit: "/replica-set/edit/",
} as const;

const list = () => client.get<ReplicaSetListResponse>({url: ReplicaSetApi.List});
const listCluster = (clusterId: string) => client.get<ReplicaSetListResponse>(
  {
    url: ReplicaSetApi.List,
    headers: {
      Cluster: clusterId,
    },
  }
);
const find = (data: ReplicaSetFindRequest) => client.post<ReplicaSetFindResponse>({
  url: ReplicaSetApi.Find,
  data
});
const create = (data: ReplicaSetCreateRequest) => client.post<ReplicaSetCreateResponse>({
  url: ReplicaSetApi.Create,
  data
});
const remove = (data: ReplicaSetDeleteRequest) => client.post<ReplicaSetDeleteResponse>({
  url: ReplicaSetApi.Delete,
  data
});
const scale = (data: ReplicaSetScaleRequest) => client.post<ReplicaSetScaleResponse>({
  url: ReplicaSetApi.Scale,
  data
});
const edit = (data: ReplicaSetEditRequest) => client.post<ReplicaSetEditResponse>({
  url: ReplicaSetApi.Edit,
  data
});

export default {
  list,
  listCluster,
  find,
  create,
  remove,
  scale,
  edit
};